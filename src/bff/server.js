// Важно для нашего BFF-эмулятора сервера соблюдать правило, что мы должны импортировать только папку bff, только к ней обращаться и из её получать сервер.
// Вот как в файле authorization.jsx: import { server } from '../../bff';
// Напрямую мы не импортируем операции, еще какие-то функции. Так как по условию задания BFF-эмулятор должен быть изолирован от другого кода, от кода клиентского приложения, это и есть изоляция. Мы не используем общий код, мы только позволяем использовать то, что отправляем во вне и это всего лишь один объект - server, внутри которого уже можно получить доступ к операциям.
// Настоящий BFF он так и работает, предоставляет во вне только ручки, за которые можно дергать, чтобы как-то работать с этим прокси. Ручки это authorize, logout, register, которые клиент дергает.

import {
	authorize,
	fetchRoles,
	fetchUsers,
	logout,
	register,
	updateUserRole,
	removeUser,
} from './operations';

export const server = {
	authorize,
	logout,
	register,
	fetchUsers,
	fetchRoles,
	updateUserRole,
	removeUser,
};

// все элементы перенс в другие файлы. Рефакторинг.
// реализуем BFF (backend for frontend server (эмулятор))

// import { getUser } from './api/get-user';
// import { addUser } from './api/add-user';
// import { sessions } from './sessions';
// import { createSession } from './create-session';

// export const server = {
// logout перенесли в файл logout.js. Рефакторинг
// // подготовим logout. Здесь мы принимаем сессию, которая представляет собой хэш и делаем ремув в объекте sessions
// async logout(session) {
// 	sessions.remove(session);
// },

// Авторизацию перенесли в отельный файл authorize.js. Рефакторинг
// async authorize(authLogin, authPassword) {
// 	// получаем только одного пользователя
// 	const user = await getUser(authLogin);

// 	if (!user) {
// 		return {
// 			error: 'Такой пользователь не найден',
// 			res: null,
// 		};
// 	}
// 	// Если пользователь найден, то сработает ниже приведенный код, следующая проверка

// 	// Если пароль пользователя для авторизации не равен паролю в наденном пользователе, то возвращаем ошибку
// 	if (authPassword !== user.password) {
// 		return {
// 			error: 'Не верный пароль',
// 			res: null,
// 		};
// 	}

// 	// Если пользователь найден и пароль совпал, то мы возвращаем пользователю сэссию, с помощью которой он сможет выполнять дополнительные действия, так как он получит больше прав после прохождения авторизации. То есть когда мы авторизовались, то пусть сервер пришлет нам не только сессию, но и все данные о пользователе в ответе res
// 	return {
// 		error: null,
// 		res: {
// 			id: user.id,
// 			login: user.login,
// 			roleId: user.role_id,
// 			// создание сессии это создание хэша. Мы с базы данных передаем в наш сервер BFF все данные юзера и пусть BFF их хранит
// 			session: sessions.create(user),
// 		},
// 	};
// },

// Регистрацию перенесли в отдельный файл register.js. Рефакторинг
// Регистрация
// Получаем здесь пользователя
// async register(regLogin, regPassword) {
// 	const existedUser = await getUser(regLogin);

// 	// Проверяем что логин, то есть существующий юзер existedUser такой уже есть, то возвращаем ошибку, а если такого юзера нет, то создаем нового юзера user
// 	if (existedUser) {
// 		return {
// 			error: 'Такой логин уже занят',
// 			res: null,
// 		};
// 	}

// 	// Если логин не занят, то добавим нового пользователя в базу данных в db.json. Вызовем для этого отдельно созданную функцию addUser и передадим в неё логин и пароль для регистрации
// 	const user = await addUser(regLogin, regPassword);
// 	// console.log(user);

// 	// и уже из нового юзера мы возьмем данные. Создаем сразу сессию, авторизуем
// 	return {
// 		error: null,
// 		res: {
// 			id: user.id,
// 			login: user.login,
// 			roleId: user.role_id,
// 			session: sessions.create(user),
// 		},
// 	};
// },
// };
