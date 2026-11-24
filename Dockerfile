# Node.js 22 подходит для установленных Vite 7 и Mongoose 9.
FROM node:22

# Рабочая папка внутри образа.
WORKDIR /usr/src/app

# Копируем проект с учётом исключений из .dockerignore.
COPY . .

# Устанавливаем зависимости фронтенда и создаём сборку frontend/dist.
WORKDIR /usr/src/app/frontend
RUN npm ci
RUN npm run build

# Устанавливаем зависимости бэкенда.
WORKDIR /usr/src/app/backend
RUN npm ci

# Указываем порт, на котором работает Express.
EXPOSE 3001

# При запуске контейнера запускаем бэкенд.
CMD ["node", "app.js"]