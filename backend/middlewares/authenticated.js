// В дополнение к работе с логином и разлогином пользователя создадим миддлевару (middleware), которая будет проверять, что пользователь залогинен

const User = require("../models/User");
const { verify } = require("../helpers/token");

// здесь мы будет расшифровывать токен и искать пользователя по идентификатору
module.exports = async function (req, res, next) {
  try {
    // разбираем наш токен. Он хранится в куках.
    const tokenData = verify(req.cookies.token);

    // далее мы можем найти пользователя используя модель User
    const user = await User.findOne({ _id: tokenData.id });
    // если пользователя нет, то выбрасываем ошибку
    if (!user) {
      // здесь вместо выбрасывания ошибки, мы можем сразу передавать её на фронтенд, так как у нас есть доступ у объекту response
      res.send({ error: "Authenticated user not found" });
      // заканчиваем выполнение миддлеваре. При этом мы не вызываем next, так как дальше обработка запроса пройти не должна
      return;
    }
    // иначе в request добавляем поле user со всей информацией о пользователе
    req.user = user;
    // вызываем функцию next
    next();
  } catch (e) {
    res.send({ error: e.message || "Token error" });
  }
};
