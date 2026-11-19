// Хэлпер (или маппер) generateToken
// импортируем jwt
const jwt = require("jsonwebtoken");

// для начала нужна подпись для jsonwebtoken
const sign = process.env.JWT_SECRET;

module.exports = {
  generate(data) {
    // возвращаем результат создания токена. Говорим, что он живет, например, 30 дней
    return jwt.sign(data, sign, { expiresIn: "30d" });
  },
  verify(token) {
    if (!token) {
      throw new Error("Invalid token");
    }
    // передаем сюда токен и наш секрет sign. На выходе будем получать информацию, которая хранится в токене
    return jwt.verify(token, sign);
  },
};
