// Загружаем переменные до подключения модулей приложения.
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

// укажем порт, на котором будем открывать наще приложение
const port = 3001;
// создадим экземпляр приложения
const app = express();

// подключим необходимые middleware - куки парсер и парсер джисона
app.use(cookieParser());
app.use(express.json());

// Все API-эндпоинты доступны с общим префиксом /api.
app.use("/api", routes);

// подключимся к базе данных. У меня уже есть готовый URL для подключения к базе - беру его с проекта 4_web_server. Там код в файле index.js, но там в строке 334 применяется уже константа хранящая URL, а само значение константы я беру уже из файла .env
// Вообще схема здесь URL такая: mongodb+srv://ЛОГИН:ПАРОЛЬ@АДРЕС_КЛАСТЕРА/.......
// далее начиная с then запускаем наше приложение
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  app.listen(port, () => {
    console.log(`Server has been started on port ${port}`);
  });
});

// проверим что наше приложение запускается, пишем в теримнале команду node app.js
