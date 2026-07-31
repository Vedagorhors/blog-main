// Добавим нового пользователя в базу данных в db.json. Выполним запрос с для записи с методом POST. Нового пользователя всегда добавляем с ролью 2 - читатель.
import { generateDate } from './generate-date';

export const addUser = (login, password) =>
	fetch('http://localhost:3005/users', {
		method: 'POST',
		// укажем заголовки и кодировку
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			login,
			password,
			// чтобы указать дату мы сделаем интереснее - создадим генератор дат
			registed_at: generateDate(),
			role_id: 2,
		}),
	}).then((createdUser) => createdUser.json());
