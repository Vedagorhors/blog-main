import { ACTION_TYPE } from './action-type';

// вообще экшены называем как константы с большой буквы все, но если это не экшен-криэйтор, но в данном случае это как раз action creator, поэтому называем в camal-case. Сюда мы должны принять хэш hash сессии session и затем должны вернуть объект.  Первый экшен setSession готов и идем его диспатчить из сервера, идем в файл authorization.js
export const setUser = (user) => ({
	type: ACTION_TYPE.SET_USER,
	payload: user,
});
