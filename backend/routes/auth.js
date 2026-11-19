const express = require("express");
const { register, login } = require("../controllers/user");
const mapUser = require("../helpers/mapUser");

const router = express.Router({ mergeParams: true });

// подключаем контроллер регистрации register (регистрацию) на post-запрос и обрабатываем ошибку с помощью try/catch
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
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
router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true }).send({});
});

module.exports = router;
