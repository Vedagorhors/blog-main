// модель для постов

const mongoose = require("mongoose");

// url-картинки будем отдельно валидировать с помощью пакета validator
const validator = require("validator");

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: "Image should be a valid url",
      },
    },
    content: {
      type: String,
      required: true,
    },
    // нужно увязать посты с комментариями, так как у одного поста может быть несколько комментариев. Мы говорим, что есть поле comments, которое представляет из себя массив, потому что у поста может быть несколько комментариев и ссылаемся на модель Comment
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

// Таким образом мы задали модели для всех сущностей, которые есть в приложении и далее мы будем использовать их в контроллерах
