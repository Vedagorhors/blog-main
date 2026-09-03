// создаем сессию и передаем сюда юзера

import { getSession, addSession, deleteSession } from './api';
export const sessions = {
	// здесь в объекте list: {} будут храниться данные о сессиях пользователей, то есть перечень активных сессий и их ключей и в них должны содержаться данные о пользователе
	// list: {}, - лист теперь пропадает
	// create создает хэш сессии, добавляем его в список list и возвращаем hash
	// ниже приведенные функции все будут вызываться как синхронные. Просто при получении сессии session нужно будт подождать (async, await)

	// create(user) {
	// 	// для получения хэша используем генератор случайных чисел
	// 	const hash = Math.random().toFixed(50);
	// 	console.log('create', user);

	// 	// this.list[hash] = user; - мы заменили это на addSession(hash, user.id);
	// 	// когда мы добавляем сессию, то у нас есть пользователь user со всеми данными
	// 	// при авторизации в базу данных мы записываем и хэш и юзера
	// 	addSession(hash, user);

	// 	return hash;
	// },

	async create(user) {
		// const hash = Math.random().toFixed(50); - у меня так с JSON сервером проблемы
		// const hash = crypto.randomUUID(); - можно это вариант
		const hash = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
		// console.log('create', user);

		// Сохраняем сессию асинхронно, но не ждём завершения
		await addSession(hash, user);

		return hash;
	},

	// Для разлогинивания удаляем сессию
	async remove(hash) {
		// находим нужную сессию по хэшу
		const session = await getSession(hash);
		// если сессии нет, то ничего не делаем
		if (!session) {
			return;
		}
		// если сессия есть, то удаляем её
		deleteSession(session.id);
		// delete this.list[hash]; - уже не нужно

		// в сессии будет три поля - id, hash,user
	},
	// проверка доступа
	async access(hash, accessRoles) {
		// чтобы проверить доступ, мы должны сначала проверить сессию и здесь нужно подождать await, когда получим из базы данных данные по хэшу. Получаем сессию с помощью getSession. getSession делаем по хэшу
		// сессия теперь есть, из неё мы получим user и hash. Получаем пользователя с помощью getUser. getUser делаем по хэшу
		const dbSession = await getSession(hash);
		// console.log('access', hash, accessRoles, dbSession);
		console.log(hash, dbSession);

		// const user = this.list[hash]; - теперь не нужно

		// // Получаем пользователя
		// const user = await getUser(hash); - уже не нужно
		// const user = dbSession.user;
		// // Проверяем: пользователь существует и его роль включена в список разрешённых ролей

		// return !!user && accessRoles.includes(user.roleId);

		// берем список сессий и ищем там сессию пользователя, таким образом получаем пользователя и он может быть, а может и не быть, поэтому нужно проверить условие
		// const user = this.list[hash]; - это теперь не нужно

		//Сделаем проще, чем как мы напимали код ниже. Убеждаемся, что пользователь есть, для того, чтобы был доступ (доступ - true) и && убеждаемся, что роль в списке ролей есть accessRoles.
		// Это означает: "доступ разрешен, если пользователь существует И его роль ВКЛЮЧЕНА в список разрешенных ролей"
		// includes(user.roleId)
		// includes возвращает либо true либо false
		// у меня была ошибка - вместо страницы Пользователи для ivan (ADMIN) отображалась Ошибка Доступ запрещен. Я вместо return !!user && !accessRoles.includes(user.roleId) написал так:
		// если пользователь не нашелся такой из сессии, то значит и сессии нет и нет доступа. Но если пользователь существует, то мы можем у него роль считать
		return !!dbSession?.user && accessRoles.includes(dbSession.user.roleId);
	},

	// if (!user) {
	// 	// если пользователя нет, возвращаем false, доступа нет такого, а если он есть, то идем дальше
	// }

	// // и проверяем, что роль пользователя, которого мы нашли, присутствует в списке accessRoles, то есть в ролях с доступом. Делаем это с помощью метода includes. Если роли в списке нет, то возвращаем false, а если роль есть в списке, то возвращаем true
	// if (!accessRoles.includes(user.roleId)) {
	// 	return false;
	// }
	// return true;
};
