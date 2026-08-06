// Выполняем действия по удалению пользователя
export const deleteUser = (userId) =>
	fetch(`http://localhost:3005/users/${userId}`, {
		// удалим данные с помощью метода DELETE
		method: 'DELETE',
	});
