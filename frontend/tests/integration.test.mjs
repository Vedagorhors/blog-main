import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { request } from '../src/utils/request.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const frontendRequire = createRequire(path.join(root, 'frontend/package.json'));
const backendRequire = createRequire(path.join(root, 'backend/package.json'));
const { transformSync } = frontendRequire('@swc/core');

// Загружаем настоящие модули и подменяем только внешние зависимости: сеть и MongoDB.
function loader(mocks = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const source = fs.readFileSync(filename, 'utf8');
    const code = filename.includes('/frontend/')
      ? transformSync(source, { jsc: { parser: { syntax: 'ecmascript', jsx: true }, target: 'es2022' }, module: { type: 'commonjs' } }).code
      : source;
    function require(specifier) {
      if (!specifier.startsWith('.')) {
        if (specifier in mocks) return mocks[specifier];
        return (filename.includes('/backend/') ? backendRequire : frontendRequire)(specifier);
      }
      let target = path.resolve(path.dirname(filename), specifier);
      if (target in mocks) return mocks[target];
      if (fs.existsSync(target + '.js')) target += '.js';
      else if (!path.extname(target)) target = path.join(target, 'index.js');
      if (target in mocks) return mocks[target];
      return load(target);
    }
    vm.runInThisContext(`(function(require,module,exports,__dirname){${code}\n})`, { filename })(require, module, module.exports, path.dirname(filename));
    return module.exports;
  }
  return (name) => load(path.join(root, name));
}

async function withFetch(fake, fn) {
  const original = globalThis.fetch;
  globalThis.fetch = fake;
  try { await fn(); } finally { globalThis.fetch = original; }
}

for (const scenario of [
  { name: 'HTTP 200 с error', status: 200, body: { error: 'Access denied' }, message: /Access denied/ },
  { name: 'HTTP 404 JSON', status: 404, body: { error: 'Статья не найдена' }, message: /Статья не найдена/ },
  { name: 'HTTP 500 без JSON', status: 500, text: '<html>Error</html>', message: /некорректный JSON/ },
  { name: 'неверный JSON при 200', status: 200, text: '{', message: /некорректный JSON/ },
  { name: 'null вместо объекта', status: 200, body: null, message: /некорректный ответ/ },
]) {
  test(`request отклоняет ${scenario.name}`, () => withFetch(
    async () => new Response(scenario.text ?? JSON.stringify(scenario.body), { status: scenario.status }),
    () => assert.rejects(request('/posts'), scenario.message),
  ));
}

test('request сохраняет /api, метод, JSON и успешные данные', () => withFetch(async (url, options) => {
  assert.equal(url, '/api/posts/p1');
  assert.equal(options.method, 'PATCH');
  assert.deepEqual(JSON.parse(options.body), { title: 'Новый заголовок' });
  return Response.json({ data: { id: 'p1' } });
}, async () => assert.deepEqual(await request('/posts/p1', 'PATCH', { title: 'Новый заголовок' }), { data: { id: 'p1' } })));

test('request передаёт сетевой сбой и принимает пустой 204', async () => {
  await withFetch(async () => { throw new Error('Network unavailable'); }, () => assert.rejects(request('/posts'), /Network unavailable/));
  await withFetch(async () => new Response(null, { status: 204 }), async () => assert.deepEqual(await request('/posts/p1', 'DELETE'), {}));
});

const files = [
  ['add-comment-async', 'addCommentAsync', ['p1', 'текст']],
  ['remove-comment-async', 'removeCommentAsync', ['p1', 'c1']],
  ['save-post-async', 'savePostAsync', ['p1', { title: 'Заголовок' }]],
  ['load-post-async', 'loadPostAsync', ['p1']],
  ['remove-post-async', 'removePostAsync', ['p1']],
  ['logout', 'logout', []],
];
for (const [file, name, args] of files) {
  test(`${name}: ошибка сервера не меняет Redux`, () => withFetch(async () => Response.json({ error: 'Access denied' }), async () => {
    const load = loader({ [path.join(root, 'frontend/src/utils/request')]: { request } });
    const action = load(`frontend/src/actions/${file}.js`)[name];
    const dispatched = [];
    const result = action(...args)((a) => dispatched.push(a));
    assert.equal(typeof result?.then, 'function');
    await assert.rejects(result, /Access denied/);
    assert.equal(dispatched.length, 0);
  }));
}

test('комментарий добавляется и удаляется только после подтверждения API', async () => {
  const actions = [];
  const load = loader({ [path.join(root, 'frontend/src/utils/request')]: { request } });
  const { addCommentAsync } = load('frontend/src/actions/add-comment-async.js');
  const { removeCommentAsync } = load('frontend/src/actions/remove-comment-async.js');
  const comment = { id: 'c1', author: 'reader', content: 'текст' };
  await withFetch(async () => Response.json({ data: comment }), async () => {
    assert.deepEqual(await addCommentAsync('p1', 'текст')((a) => actions.push(a)), comment);
    assert.deepEqual(actions[0].payload, comment);
  });
  await withFetch(async (url, options) => {
    assert.equal(url, '/api/posts/p1/comments/c1');
    assert.equal(options.method, 'DELETE');
    return Response.json({ error: null });
  }, () => removeCommentAsync('p1', 'c1')((a) => actions.push(a)));
  assert.equal(actions[1].payload, 'c1');
});

test('сохранение выбирает POST или PATCH и возвращает статью; устаревшая загрузка не меняет Redux', async () => {
  const load = loader({ [path.join(root, 'frontend/src/utils/request')]: { request } });
  const { savePostAsync } = load('frontend/src/actions/save-post-async.js');
  const { loadPostAsync } = load('frontend/src/actions/load-post-async.js');
  for (const id of [undefined, 'p1']) {
    await withFetch(async (_url, options) => {
      assert.equal(options.method, id ? 'PATCH' : 'POST');
      return Response.json({ data: { id: 'p1' } });
    }, async () => assert.equal((await savePostAsync(id, {})((a) => a)).id, 'p1'));
  }
  await withFetch(async () => Response.json({ data: { id: 'p1' } }), async () => {
    const actions = [];
    await loadPostAsync('p1', () => false)((a) => actions.push(a));
    assert.equal(actions.length, 0);
  });
});

test('backend: отсутствующая статья — 404; поиск экранируется и сортируется стабильно', async () => {
  let filter, sorting;
  const model = {
    findById: () => ({ populate: async () => null }),
    findByIdAndUpdate: async () => null,
    find: (query) => { filter = query; return { limit: () => ({ skip: () => ({ sort: (value) => { sorting = value; return []; } }) }) }; },
    countDocuments: async () => 0,
  };
  const load = loader({ [path.join(root, 'backend/models/Post')]: model });
  const { getPost, editPost, getPosts } = load('backend/controllers/post.js');
  await assert.rejects(getPost('missing'), (e) => e.status === 404);
  await assert.rejects(editPost('missing', {}), (e) => e.status === 404);
  await getPosts('C++ & [React]');
  assert.equal(filter.title.$regex, 'C\\+\\+ & \\[React\\]');
  assert.deepEqual(sorting, { createdAt: -1, _id: -1 });
});

test('mapUser возвращает дату регистрации', () => {
  const load = loader();
  const map = load('backend/helpers/mapUser.js');
  const createdAt = new Date('2026-11-20T10:00:00Z');
  assert.equal(map({ id: 'u1', login: 'user', role: 2, createdAt }).registeredAt, createdAt);
});

test('API middleware возвращает JSON 400/404/500 и скрывает внутренние подробности', () => {
  let handler;
  const app = {
    use: (url, fn) => { if (url === '/api' && fn?.length === 4) handler = fn; },
    get: () => {},
  };
  const express = Object.assign(() => app, { json: () => () => {}, static: () => () => {} });
  loader({ express, mongoose: { connect: () => ({ then: () => {} }) },
    dotenv: { config: () => {} }, [path.join(root, 'backend/routes')]: {},
  })('backend/app.js');
  for (const [error, expected] of [
    [Object.assign(new Error('cast detail'), { name: 'CastError' }), 400],
    [Object.assign(new Error('Статья не найдена'), { status: 404 }), 404],
    [new Error('private database details'), 500],
  ]) {
    let status, body;
    const res = { status: (value) => { status = value; return res; }, json: (value) => { body = value; } };
    handler(error, {}, res, () => {});
    assert.equal(status, expected);
    assert.equal(typeof body.error, 'string');
    assert.ok(!body.error.includes('private database details'));
  }
});
