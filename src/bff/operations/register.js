import { addUser, getUser } from '../api';
import { sessions } from '../sessions';

export const register = async (regLogin, regPassword) => {
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
};
