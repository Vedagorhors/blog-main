import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';
// import { server } from '../bff';

export const logout = () => {
	// server.logout(session);
	request('/logout', 'POST');
	return {
		type: ACTION_TYPE.LOGOUT,
	};
};
