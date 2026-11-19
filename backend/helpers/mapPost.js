// Маппер для постов. Копируем поля как получили их в Thunder Client, убираем ненужное поля v, updatedAt. Поле image  переименуем в imageUrl, _id переиvенуем в id. Вместо createdAt возращаем publishedAt

const mongoose = require("mongoose");
const mapComment = require("./mapComment");

// Добавим также этот маппер в маппер постов, так как в постах могут быть комментарии, но важный момент - в комментариях могут храниться идентификаторы либо развернутые комментарии в виде объектов. Нам нужно идентификаторы оставлять как есть, они нам пригодятся, например,  на списке постов, там нам достаточно знать количество комментариев либо мы будем превращать комментарии в правильные объекты с помощью маппера mapComment.

module.exports = function (post) {
  return {
    id: post.id,
    title: post.title,
    imageUrl: post.image,
    content: post.content,
    // добавим здесь map  м нам нужно проверить является ли comment идентификатором - это можно сделать с помощью встроенной функции mongoose.isObjectIdOrHexString. Если это objectId, тогда оставляем как есть иначе превращаем с помощью mapComment
    comments: post.comments.map((comment) =>
      mongoose.isObjectIdOrHexString(comment) ? comment : mapComment(comment),
    ),
    publishedAt: post.createdAt,
  };
};

// проверяем в Thunder Client и вдими, что у нас теперь возвращаются комментарии в правильном виде
