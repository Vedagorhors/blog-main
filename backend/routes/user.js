const express = require("express");
const { getUsers, getRoles, updateUser, deleteUser } = require("../controllers/user");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ROLES = require("../constants/roles");
const mapUser = require("../helpers/mapUser");

const router = express.Router({ mergeParams: true });

// дальше подключаем контроллеры
// на /users будем возвращать всех пользователей и добавляем миддлевару hasRole, потому что только администратор имеет доступ к этому эндпоинту
router.get("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  // вызываем наш контроллер
  const users = await getUsers();
  // отправляем данные клиенту
  res.send({ data: users.map(mapUser) });
});
// проверяем в расширении Thunder Client, что контроллер работает. Получим там информацию о пользователях на нашем сайте. Там содержится какое-то количество служебной информации и давайте от неё избавимся, потому что светить даже хэш пароля все равно небезопасно. Поэтому применим к users  метод map и допишем mapUser - смвыше res.send({ data: users.map(mapUser) })
// Итак нам возвращаются уже защищенные данные, без хэша пароля, тоесть содержат правильные поля нужные для фронтенда - смотрим это в расширении Thunder Client. Если нам нужно будет поменять представление пользователя во всем приложении, то достаточно будет это сделать в функции mapUser.

// подключаем контроллер получения ролей
router.get("/roles", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const roles = getRoles();

  res.send({ data: roles });
});

// контроллер редактирования пользователя
router.patch("/:id", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const newUser = await updateUser(req.params.id, {
    // и помним, что мы хотели давать возможность менять только роли, а это значит, что мы передаем объект, куда руками достаем только одно поле. Контроллер при этом поддерживает изменение любых полей. Это удобно, если мы захотим из каких-то других эндпоинтов или каким-то другим оббразом менять пользователя полностью. В пользователе (User.js) роль называется role, при этом фронтенд оперирует наименованием roleId
    role: req.body.roleId,
  });
  // не забываем использовать mapUser
  res.send({ data: mapUser(newUser) });
});
// проверим в Thunder Client, что этот эндпоинт работает. Видм что в пользователях у нас есть модератор с "roleId": 1. Сделаем его администратором "roleId": 0 - это сделаем в Thunder Client

// Контроллер удаление пользователя
router.delete("/:id", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  await deleteUser(req.params.id);

  res.send({ error: null });
});

// проверяем в Thunder Client, что он работает. Удалили свежеиспеченного администратора.
// Мы добавили все контроллеры, которые необходимы для работы с пользователем.

module.exports = router;
