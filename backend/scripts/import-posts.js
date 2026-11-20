// Разовый перенос статей из старого json-server в MongoDB.
// Без --apply выполняется только проверка и показывается план переноса.
const path = require("node:path");
const fs = require("node:fs/promises");
const os = require("node:os");
const { createHash } = require("node:crypto");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const mongoose = require("mongoose");
const Post = require("../models/Post");

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--apply")) {
    throw new Error("Допустим только аргумент --apply; без него запись отключена.");
  }
  const apply = args.includes("--apply");
  const source = path.resolve(__dirname, "../../frontend/src/db.json");
  const { posts } = JSON.parse(await fs.readFile(source, "utf8"));
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("В db.json нет статей для переноса.");
  }
  const ids = new Set();
  // Сначала проверяем все записи: неверная статья не должна приводить к частичному импорту.
  const documents = await Promise.all(posts.map(async (post) => {
    if (!post.id || ids.has(String(post.id))) {
      throw new Error("В исходных статьях отсутствует или повторяется id.");
    }
    ids.add(String(post.id));
    // В старых датах не было часового пояса. При переносе считаем их временем UTC.
    const dateText = String(post.published_at).replace(" ", "T");
    const createdAt = new Date(dateText.includes("T") ? `${dateText}Z` : `${dateText}T00:00:00Z`);
    if (Number.isNaN(createdAt.getTime())) {
      throw new Error(`Некорректная дата статьи ${post.id}`);
    }
    // Один исходный id всегда даёт один MongoDB _id: повторный запуск не создаёт дублей.
    const id = createHash("sha256").update(`BLOG:db.json:posts:${post.id}`).digest("hex").slice(0, 24);
    const document = new Post({
      _id: id,
      title: post.title,
      image: post.image_url,
      content: post.content,
      comments: [],
      createdAt,
      updatedAt: createdAt,
    });
    try {
      await document.validate();
    } catch {
      throw new Error(`Статья ${post.id} не прошла проверку модели Post.`);
    }
    return document;
  }));

  if (!process.env.DB_CONNECTION_STRING) throw new Error("Не задан DB_CONNECTION_STRING.");
  await mongoose.connect(process.env.DB_CONNECTION_STRING, { serverSelectionTimeoutMS: 15000 });
  const pending = [];
  for (const document of documents) {
    const sameId = await Post.findById(document._id);
    if (sameId) {
      // Уже импортированную статью не перезаписываем: пользователь мог её отредактировать.
      continue;
    }
    const sameContent = await Post.exists({
      title: document.title, image: document.image, content: document.content,
    });
    if (!sameContent) pending.push(document);
  }
  console.log(`База: ${mongoose.connection.name}; исходных статей: ${documents.length}; новых: ${pending.length}; пропущено: ${documents.length - pending.length}.`);
  if (!apply) {
    console.log("Проверка завершена без записи. Для переноса добавьте --apply.");
    return;
  }
  if (pending.length > 0) {
    // Перед записью сохраняем снимок существующих статей отдельно от Git.
    const backupDir = await fs.mkdtemp(path.join(os.tmpdir(), "blog-posts-backup-"));
    const backupPath = path.join(backupDir, "posts-before-import.json");
    await fs.writeFile(backupPath, JSON.stringify(await Post.find().lean(), null, 2), { mode: 0o600 });
    console.log(`Резервная копия статей до переноса: ${backupPath}`);
    for (const document of pending) await document.save();
  }
  console.log(`Перенесено: ${pending.length}. Исходный db.json, пользователи и комментарии не изменялись.`);
}

main()
  .catch((error) => {
    // Не печатаем ошибку подключения целиком: она может содержать адрес или учётные данные.
    console.error(error.name === "MongooseServerSelectionError" ? "MongoDB недоступна; проверьте подключение и доступ к кластеру." : "Перенос не завершён: " + error.message.replace(/mongodb(?:\+srv)?:\/\/\S+/g, "[скрытый адрес]"));
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
