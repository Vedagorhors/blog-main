// контроллер пользователя
// здесь нам нужны будут регистрация, логин и логаут

// подключим bcrypt
const bcrypt = require("bcrypt");
// подключим модель пользоватля
const User = require("../models/User");
const { generate } = require("../helpers/token");
// Подключаем константу ROLES
const ROLES = require("../constants/roles");

// register
// здесь нужно захэшировать пароль с использованием bcrypt
async function register(login, password) {
  // создаем хэш от пароля. БУдут стандартные 10 раундов хэширования. hash упадет, если пароль будет пустым и для того, чтобы мы на фронтенд не отправляли ошибку о том, что у нас упал конкретно bcrypt мы будем проверять наличие пароля заранее
  if (!password) {
    throw new Error("Password is empty");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  // создаем пользователя  и передадим сюда данные - логин и хэш пароля (помним о безопасности и не зраним сам пароль в открытом виде)
  const user = await User.create({ login, password: passwordHash });
  // добавим удобство для наших пользователей.Когда пользователь регистрируется, мы можем сразу его залогинить для того, чтобы не приходилось заполнять форму входа отдельно от формы регистрации. Для этого мы сгенерируем токен в регистрации точно так же, как при логине
  const token = generate({ id: user.id });

  // возвращаем токен вместе с пользователем
  return { user, token };
  //  и дальше в app.js получаем и user и token
}

// login
async function login(login, password) {
  // ищем пользователя по логину, то есть осуществляем идентификацию
  const user = await User.findOne({ login });
  // если нет пользователя, то выбрасываем ошибку
  if (!user) {
    throw new Error("User not found");
  }
  // сравниваем пароли. Используем bcrypt. Сравниваем наш пароль и хэш пароля, который хранится
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  // если пароли не сходятся, выбрасываем ошибку
  if (!isPasswordMatch) {
    throw new Error("Wrong password");
  }
  //иначе генерируем токен, для этого создадим отдельный хэлпер(маппер), чтобы нам не приходилось в разных частях приложения копировать логику про использование модуля jsonwebtoken. Генерировать будем из идентификатора пользователя
  const token = generate({ id: user.id });
  // возвращаем информацию о токе и пользователе
  return { token, user };
  // теперь нужно написать функцию generateToken. Создадим файл generateToken.js в папке helpers
}

// logout - отдельный контроллер не пригодился

// также нужно управление пользователями от имени администратора:
// что нужно администратору для того, чтобы управлять пользователями? Для начала получение пользователей и ролей
// получим пользователей:
function getUsers() {
  return User.find();
}
// получим роли. Роли сохранены в константах, поэтому делаем контроллер, который будет формировать правильный массив с данными о ролях. Подключаем выше константу ROLES
function getRoles() {
  return [
    { id: ROLES.ADMIN, name: "Admin" },
    { id: ROLES.MODERATOR, name: "Moderator" },
    { id: ROLES.USER, name: "User" },
  ];
}

// delete. Обрабатываем удаление пользователя
function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

// edit (roles). Контроллер изменения пользователя. Используем метод findByIdAndUpdate. Первым аргументом передаем идентификатор пользователя id, дальше новые данные userData и если оставить так, то этот метод будет возвращать нам старые данные о пользователе - именно так работает mongoose. Если мы хотим возвращать на фроненд новые данные о пользователе, тогда нам нужно передать третий параметр с настройками - это объект с одним параметром returnDocument со значением after. Так мы говорим, что нам необходимо вернуть документ, который будет содержать уже обновленные данные
function updateUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, { returnDocument: "after" });
}

// экспортируем все контроллеры
module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  deleteUser,
  updateUser,
};

// Теперь подключим контроллеры в app.js и делаем это только после middleware authenticated, потому что только аутентифицированный пользователь и только пользователь с ролью Админ может получать доступ к этим контроллерам
