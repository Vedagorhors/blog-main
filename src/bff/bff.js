import { getUser } from './get-user';
import { addUser } from './add-user';
import { createSession } from './create-session';

export const server = {
	async authorize(authLogin, authPassword) {
		// получаем только одного пользователя
		const user = await getUser(authLogin);

		if (!user) {
			return {
				error: 'Такой пользователь не найден',
				res: null,
			};
		}
		// Если пользователь найден, то сработает ниже приведенный код, следующая проверка

		// Если пароль пользователя для авторизации не равен паролю в наденном пользователе, то возвращаем ошибку
		if (authPassword !== user.password) {
			return {
				error: 'Не верный пароль',
				res: null,
			};
		}

		// Если пользователь найден и пароль совпал, то мы возвращаем пользователю сэссию, с помощью которой он сможет выполнять дополнительные действия, так как он получит болььше прав после прохождения авторизации.
		return {
			error: null,
			res: createSession(user.role_id),
		};
	},

	// Регистрация
	async register(regLogin, regPassword) {
		const user = await getUser(regLogin);

		// Проверяем что логин такой не занят
		if (user) {
			return {
				error: 'Такой логин уже занят',
				res: null,
			};
		}

		// Добавим нового пользователя в базу данных в db.json. Вызовем для этого отдельно созданную функцию addUser и передадим в неё логин и пароль для регистрации
		await addUser(regLogin, regPassword);

		// если же полльзователь не найден, значит логин свободен
		return {
			error: null,
			// если пользователь зарегестрировался, то возвращаем ему сессию и пусть пользуется своими права согласго роли (при регистрации отведена роль читателя)
			res: createSession(user.role_id),
		};
	},
};
