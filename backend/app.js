// подключаем:
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  register,
  login,
  getUsers,
  getRoles,
  updateUser,
  deleteUser,
} = require("./controllers/user");
const {
  getPost,
  getPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/post");
const mapUser = require("./helpers/mapUser");
const authenticated = require("./middlewares/authenticated");
const hasRole = require("./middlewares/hasRole");
const ROLES = require("./constants/roles");
const mapPost = require("./helpers/mapPost");
const { addComment, deleteComment } = require("./controllers/comment");
const mapComment = require("./helpers/mapComment");

// укажем порт, на котором будем открывать наще приложение
const port = 3001;
// создадим экземпляр приложения
const app = express();

// подключим необходимые middleware - куки парсер и парсер джисона
app.use(cookieParser());
app.use(express.json());

// подключаем контроллер регистрации register (регистрацию) на post-запрос и обрабатываем ошибку с помощью try/catch
app.post("/register", async (req, res) => {
  try {
    // в контроллер передаем данные из тела body нашего запроса и, если все хорошо, то отправляем ответ.
    // в присоединении контроллера регистрации получаем и пользователя и токен. Теперь пользовтелю не нужно будет отдельно заполнять форму логина и даже если он только зарегистрировался. Сразу после регистрации он попадет на главную страницу и сможет пользоваться нашим сайтом
    const { user, token } = await register(req.body.login, req.body.password);
    // и отправляем токен в куках точно так же, как при логине
    res
      .cookie("token", token, { httpOnly: true })
      // отправляем ответ с пользователя
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    // будем отправлять на фронтенд ответ в формате json где будет два поля error  и user. В случае с ошибкой отправляем e.message или строку Unknown error
    res.send({ error: e.message || "Unknown error" });
  }
});

// подключаем контроллер логина
app.post("/login", async (req, res) => {
  try {
    // важный момент - здесь еще нужно установить токен в куки. Для того, чтобы этим не занимался сам контроллер мы будем на выходе ожидать объект с двумя полями user  и token.
    const { user, token } = await login(req.body.login, req.body.password);
    // token будем устанавливать в куки. Укажем httpOnly куки, чтобы не было доступа с JavaScript и таким образом мы защищаем нашу куку.
    res
      .cookie("token", token, { httpOnly: true })
      // отправляем ответ с пользователя
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
});

// подключаем контроллер логаута. Здесь нам не понадобится одельный контроллер. Мы будем просто очищать токен из кук
// send({}) - отправляем тело, то есть отправляем просто пустой объект. Теперь токен будет обнуляться
app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true }).send({});
});

// Теперь подключим контроллеры в app.js и делаем это только после middleware authenticated, потому что только аутентифицированный пользователь и только пользователь с ролью Админ может получать доступ к этим контроллерам
// Контроллеры получения нескольких постов и одного поста мы подключаем до миддлеваре authenticated, потому что даже гости можгут посмотреть один пост и список постов.

app.get("/posts", async (req, res) => {
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
app.get("/posts/:id", async (req, res) => {
  const post = await getPost(req.params.id);

  res.send({ data: mapPost(post) });
});

// подключаем миддлевару authenticated
app.use(authenticated);

// добавляем/подключаем контроллер комментариев. роли мы не контролируем, потому что любой залогиненный пользователь может оставлять комментарии.
app.post("/posts/:id/comments", async (req, res) => {
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
app.delete(
  "/posts/:postId/comments/:commentId",
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  async (req, res) => {
    await deleteComment(req.params.postId, req.params.commentId);

    res.send({ error: null });
  },
);
// проверяем работу в Thunder Client

// теперь добавляем редактирование добавления и удаления постов. Делаем это после миддлеваре authenticated, потому что нам необходимо контролировать роли. Итак, добавляем контроллеры для работы с постами.
// Добавление постов доступно только Админу.
app.post("/posts", hasRole([ROLES.ADMIN]), async (req, res) => {
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
app.patch("/posts/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
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
app.delete("/posts/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
  await deletePost(req.params.id);

  res.send({ error: null });
});

// дальше подключаем контроллеры
// на /users будем возвращать всех пользователей и добавляем миддлевару hasRole, потому что только администратор имеет доступ к этому эндпоинту
app.get("/users", hasRole([ROLES.ADMIN]), async (req, res) => {
  // вызываем наш контроллер
  const users = await getUsers();
  // отправляем данные клиенту
  res.send({ data: users.map(mapUser) });
});
// проверяем в расширении Thunder Client, что контроллер работает. Получим там информацию о пользователях на нашем сайте. Там содержится какое-то количество служебной информации и давайте от неё избавимся, потому что светить даже хэш пароля все равно небезопасно. Поэтому применим к users  метод map и допишем mapUser - смвыше res.send({ data: users.map(mapUser) })
// Итак нам возвращаются уже защищенные данные, без хэша пароля, тоесть содержат правильные поля нужные для фронтенда - смотрим это в расширении Thunder Client. Если нам нужно будет поменять представление пользователя во всем приложении, то достаточно будет это сделать в функции mapUser.

// подключаем контроллер получения ролей
app.get("/users/roles", hasRole([ROLES.ADMIN]), async (req, res) => {
  const roles = getRoles();

  res.send({ data: roles });
});

// контроллер редактирования пользователя
app.patch("/users/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
  const newUser = await updateUser(req.params.id, {
    // и помним, что мы хотели давать возможность менять только роли, а это значит, что мы передаем объект, куда руками достаем только одно поле. Контроллер при этом поддерживает изменение любых полей. Это удобно, если мы захотим из каких-то других эндпоинтов или каким-то другим оббразом менять пользователя полностью. В пользователе (User.js) роль называется role, при этом фронтенд оперирует наименованием roleId
    role: req.body.roleId,
  });
  // не забываем использовать mapUser
  res.send({ data: mapUser(newUser) });
});
// проверим в Thunder Client, что этот эндпоинт работает. Видм что в пользователях у нас есть модератор с "roleId": 1. Сделаем его администратором "roleId": 0 - это сделаем в Thunder Client

// Контроллер удаление пользователя
app.delete("/users/:id", hasRole([ROLES.ADMIN]), async (req, res) => {
  await deleteUser(req.params.id);

  res.send({ error: null });
});

// проверяем в Thunder Client, что он работает. Удалили свежеиспеченного администратора.
// Мы добавили все контроллеры, которые необходимы для работы с пользователем.

// подключимся к базе данных. У меня уже есть готовый URL для подключения к базе - беру его с проекта 4_web_server. Там код в файле index.js, но там в строке 334 применяется уже константа хранящая URL, а само значение константы я беру уже из файла .env
// Вообще схема здесь URL такая: mongodb+srv://ЛОГИН:ПАРОЛЬ@АДРЕС_КЛАСТЕРА/.......
// далее начиная с then запускаем наше приложение
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  app.listen(port, () => {
    console.log(`Server has been started on port ${port}`);
  });
});

// проверим что наше приложение запускается, пишем в теримнале команду node app.js
