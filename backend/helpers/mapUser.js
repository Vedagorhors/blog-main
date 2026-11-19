// создадим маппер (helper). Это будет функция, которая будет возвращать только определенные поля о пользователе, так как нам не хочется на фронтенд отправлять все поля пользователя

module.exports = function (user) {
  return {
    id: user.id,
    login: user.login,
    // роль пользователя храним в поле role
    roleId: user.role,
    // registeredAt: user.createdAt
  };
};
