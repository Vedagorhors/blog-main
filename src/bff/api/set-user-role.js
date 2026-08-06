// Выполняем действия по установке роли
export const setUserRole = (userId, roleId) =>
	fetch(`http://localhost:3005/users/${userId}`, {
		// обновим данные с помощью метода PATCH. Метод позволяет обновить не все данные, а выборочно. В метод передаем новые данные о пользователе
		method: 'PATCH',
		// укажем заголовки и кодировку
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			role_id: roleId,
		}),
	});
