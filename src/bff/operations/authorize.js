import { getUser } from '../api';
import { sessions } from '../sessions';

export const authorize = async (authLogin, authPassword) => {
	const user = await getUser(authLogin);

	if (!user) {
		return {
			error: 'Такой пользователь не найден',
			res: null,
		};
	}

	const { id, login, password, roleId } = user;

	if (authPassword !== password) {
		return {
			error: 'Не верный пароль',
			res: null,
		};
	}

	const sessionHash = await sessions.create(user);

	return {
		error: null,
		res: {
			id,
			login,
			roleId,
			session: sessionHash,
		},
	};
};
