// реализуем BFF (backend for frontend server (эмулятор))

import { getUser } from './get-user';
import { addUser } from './add-user';
import { sessions } from './sessions';
// import { createSession } from './create-session';

export const server = {
	// подготовим logout. Здесь мы принимаем сессию, которая представляет собой хэш и делаем ремув в объекте sessions
	async logout(session) {
		sessions.remove(session);
	},
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

		// Если пользователь найден и пароль совпал, то мы возвращаем пользователю сэссию, с помощью которой он сможет выполнять дополнительные действия, так как он получит больше прав после прохождения авторизации. То есть когда мы авторизовались, то пусть сервер пришлет нам не только сессию, но и все данные о пользователе в ответе res
		return {
			error: null,
			res: {
				id: user.id,
				login: user.login,
				roleId: user.role_id,
				// создание сессии это создание хэша. Мы с базы данных передаем в наш сервер BFF все данные юзера и пусть BFF их хранит
				session: sessions.create(user),
			},
		};
	},

	// Регистрация
	// Получаем здесь пользователя
	async register(regLogin, regPassword) {
		const existedUser = await getUser(regLogin);

		// Проверяем что логин, то есть существующий юзер existedUser такой уже есть, то возвращаем ошибку, а если такого юзера нет, то создаем нового юзера user
		if (existedUser) {
			return {
				error: 'Такой логин уже занят',
				res: null,
			};
		}

		// Если логин не занят, то добавим нового пользователя в базу данных в db.json. Вызовем для этого отдельно созданную функцию addUser и передадим в неё логин и пароль для регистрации
		const user = await addUser(regLogin, regPassword);
		// console.log(user);

		// и уже из нового юзера мы возьмем данные. Создаем сразу сессию, авторизуем
		return {
			error: null,
			res: {
				id: user.id,
				login: user.login,
				roleId: user.role_id,
				session: sessions.create(user),
			},
		};
	},
};
