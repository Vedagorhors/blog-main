// подготовим logout - это значит разлогиниваемся, то есть нажимаем на кнопку Выйти.
//  Здесь мы принимаем сессию, которая представляет собой хэш и делаем ремув в объекте sessions

import { sessions } from '../sessions';

export const logout = async (userSession) => {
	await sessions.remove(userSession);
};
