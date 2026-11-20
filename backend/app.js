// Загружаем переменные до подключения модулей приложения.
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("node:path");
const routes = require("./routes");

// укажем порт, на котором будем открывать наще приложение
const port = 3001;
// создадим экземпляр приложения
const app = express();

// Vite собирает фронтенд в dist. __dirname указывает на папку backend,
// поэтому путь не зависит от того, из какой папки запущена команда node.
const frontendDist = path.resolve(__dirname, "../frontend/dist");

// подключим необходимые middleware - куки парсер и парсер джисона
app.use(cookieParser());
app.use(express.json());

// Все API-эндпоинты доступны с общим префиксом /api.
app.use("/api", routes);

// Неизвестный API-адрес возвращает JSON с ошибкой, а не страницу React.
// Этот обработчик должен стоять после API и перед раздачей фронтенда.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Отдаём готовые файлы сборки: index.html, JavaScript, CSS и изображения.
// Перед проверкой на localhost:3001 выполняем npm run build в frontend.
app.use(express.static(frontendDist));

// При прямом открытии или обновлении /login, /post/:id и других страниц
// возвращаем index.html. Затем React Router выбирает нужную страницу.
// В Express 5 звёздочке нужно имя; фигурные скобки включают также путь /.
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// подключимся к базе данных. У меня уже есть готовый URL для подключения к базе - беру его с проекта 4_web_server. Там код в файле index.js, но там в строке 334 применяется уже константа хранящая URL, а само значение константы я беру уже из файла .env
// Вообще схема здесь URL такая: mongodb+srv://ЛОГИН:ПАРОЛЬ@АДРЕС_КЛАСТЕРА/.......
// далее начиная с then запускаем наше приложение
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  app.listen(port, () => {
    console.log(`Server has been started on port ${port}`);
  });
});

// проверим что наше приложение запускается, пишем в теримнале команду node app.js
