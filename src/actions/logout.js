import { ACTION_TYPE } from './action-type';
import { server } from '../bff';

// создадим action-creator. В этом экшене, который по сути синхронный, вызывается асинхронный код, запрашивающий сервер
export const logout = (session) => {
	server.logout(session);
	return {
		type: ACTION_TYPE.LOGOUT,
	};
};
