// модель для комментария

const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    // говорим, что автор является идентификатором пользователя и с помощью поля ref указываем имя модели, на которую мы ссылаемся, то есть на User
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
