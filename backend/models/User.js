// модель для пользователя

// импортируем монгус
const mongoose = require("mongoose");

// подключим роли
const roles = require("../constants/roles");

const UserSchema = mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: roles.USER,
    },
    // для пользователя еще нужна дата регистрации, то есть дата создания документа внутри MongoDB. Это можно создать либо самостоятельно либо на откуп , а именно в схеме указываем доп. поле { timestamps: true } - теперь монгус будет добавлять к каждому документу два поля created add (создание документа) и upduted add (последнее редактирование документа):
  },
  { timestamps: true },
);

// Теперь создадим из этого модель
const User = mongoose.model("User", UserSchema);

// экспортируем модель
module.exports = User;
