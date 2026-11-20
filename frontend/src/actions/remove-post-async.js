// Интеграция фронтенда с бэкендом. Убираем requestServer

import { request } from '../utils/request';

// export const removePostAsync = (requestServer, id) => () =>
export const removePostAsync = (id) => () =>
	// requestServer('removePost', id);
	request(`/posts/${id}`, 'DELETE');
