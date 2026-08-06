// подготовим logout. Здесь мы принимаем сессию, которая представляет собой хэш и делаем ремув в объекте sessions

import { sessions } from '../sessions';

export const logout = async (userSession) => {
	sessions.remove(userSession);
};
