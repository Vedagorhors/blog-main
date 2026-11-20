import { request } from '../utils/request';
import { setPostData } from './set-post-data';

// Интеграция фронтенда с бэкендом. Убираем requestServer,
// export const savePostAsync = (requestServer, newPostData) => (dispatch) =>
// здесь принимаем id и в зависимости от того, есть у нас идентификатор id или нет будем делать разные запросы
export const savePostAsync = (id, newPostData) => (dispatch) => {
	// создадим отдельный запрос где с помощью тернарного оператора объявим вызов request с одними параметрами либо с другими.
	const saveRequest = id
		? request(`/posts/${id}`, 'PATCH', newPostData)
		: request('/posts/', 'POST', newPostData);
	// request('savePost', newPostData).then((updatedPost) => {

	// этот промис нужно возращать (return), чтобы к нему дальше можно было присоединиться с помощью then в файле post-form (.then(({ id }) => navigate(`/post/${id}`)))
	return saveRequest.then(({ error, data }) => {
		if (error) {
			throw new Error(error);
		}

		if (!data?.id) {
			throw new Error('Сервер не вернул сохранённую статью');
		}

		dispatch(setPostData(data));
		return data;
	});
};
