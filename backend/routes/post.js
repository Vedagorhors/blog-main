const express = require("express");
const { getPost, getPosts, addPost, editPost, deletePost } = require("../controllers/post");
const { addComment, deleteComment } = require("../controllers/comment");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ROLES = require("../constants/roles");
const mapPost = require("../helpers/mapPost");
const mapComment = require("../helpers/mapComment");

const router = express.Router({ mergeParams: true });

// Просмотр статей доступен гостям; изменение — после проверки пользователя и роли.
router.get("/", async (req, res) => {
  const { posts, lastPage } = await getPosts(
    req.query.search,
    req.query.limit,
    req.query.page,
  );
  // возвращаем данные о постах. Здесь подключаем наш маппер mapPosts и проверям в Thunder Client какие данные с полями получаем - там все получаем как прописали в mapPost.js
  res.send({ data: { lastPage, posts: posts.map(mapPost) } });
});
// проверяем в Thunder Client запрос. Некоторые поля называются не так, как их ожидает фронтенд, поэтому сделаем маппер для постов mapPost.js

// подключаем контроллер получения одного поста
router.get("/:id", async (req, res) => {
  const post = await getPost(req.params.id);

  res.send({ data: mapPost(post) });
});


// добавляем/подключаем контроллер комментариев. роли мы не контролируем, потому что любой залогиненный пользователь может оставлять комментарии.
router.post("/:id/comments", authenticated, async (req, res) => {
  const newComment = await addComment(req.params.id, {
    // в данные комментария передаем контент и пользователя. для пользователя передаем идентификатори этот идентификатор получаем не с фронтенда, а из нашей миддлеваре authenticated. Она добавляет в req.user пользователя и мы можем взять оттуда id - так мы не позволим одному пользователю представиться другим.
    content: req.body.content,
    author: req.user.id,
  });
  // используем маппер mapComment
  res.send({ data: mapComment(newComment) });
});

// проверяем работу в Thunder Client. Видим в ответе по запросу добавления комментария какие-то появлись вспомогательные поля, а у автора просто передает идентификатор. Если посмотрим на сам пост, то в комментарии у него тоже идентификатор. Оперировать этим будет неудобно с фронтенда, поэтому добавим полезную логику, а именно в комментариях нам нужно рпевратить автора из безликого идентификатора в объект с информацией об авторе. Так как в комментах у нас есть связь с автором (в Comments.js в CommentSchema), то мы можем попросить mongoose заполнить информацию об авторе за нас. Пишем в comments.js.
// После добавления маппера mapComment видим, что у нас появилась локаничная нужная информация о комментарии, то что мы и хотели.

// удаление комментария. Ограничиваем доступ к этому эндпоинту по ролям - здесь будет уже две роли - либо админ либо модератор.
router.delete(
  "/:postId/comments/:commentId",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  async (req, res) => {
    await deleteComment(req.params.postId, req.params.commentId);

    res.send({ error: null });
  },
);
// проверяем работу в Thunder Client

// Для изменения статей сначала проверяем пользователя, затем роль администратора.
// Добавление постов доступно только Админу.
router.post("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const newPost = await addPost({
    // на этом этапе мы фильтруем какие поля попадут в наш контроллер, это три поля. image на фроненде называется imageUrl
    title: req.body.title,
    content: req.body.content,
    image: req.body.imageUrl,
  });
  // возвращаем данные. проверяем в Thunder Client
  res.send({ data: mapPost(newPost) });
});

// редактирование
router.patch("/:id", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const updatedPost = await editPost(
    // первым аргументом необходимо передать id, а дальше идут поля, которые должны поменяться.
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      image: req.body.imageUrl,
    },
  );

  // возвращаем данные. проверяем в Thunder Client
  res.send({ data: mapPost(updatedPost) });
});

// Удаление
router.delete("/:id", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  await deletePost(req.params.id);

  res.send({ error: null });
});

module.exports = router;
