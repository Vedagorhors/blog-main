import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';
// import { server } from '../bff';

export const logout = () => (dispatch) => {
	// server.logout(session);
	// Меняем состояние только после подтверждения выхода сервером.
	return request('/logout', 'POST').then(() => {
		dispatch({ type: ACTION_TYPE.LOGOUT });
	});
};
