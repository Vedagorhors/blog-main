// Утилита checkAccess проверяет, что доступ в userRole включен

export const checkAccess = (access, userRole) => access.includes(userRole);
