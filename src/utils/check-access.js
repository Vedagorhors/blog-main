// Утилита checkAccess проверяет, что доступ в userRole включен
// Я оставил для наглядности (был такой вариант) файл check-access.js  еще и в другой папке utils что в папке bff, но в самом файле весь код закомментирован, файл не используется (просто для истории)

export const checkAccess = (access, userRole) => access.includes(userRole);
