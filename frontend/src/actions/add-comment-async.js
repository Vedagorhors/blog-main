import { request } from '../utils/request';
import { addComment } from './add-comment';
// import { setPostData } from './set-post-data';

export const addCommentAsync = (postId, content) => (dispatch) => {
	// Интеграция фронтенда с бэкендом
	// requestServer('addPostComment', userId, postId, content).then((postData) => {
	return request(`/posts/${postId}/comments`, 'POST', { content }).then((comment) => {
		if (!comment.data?.id) throw new Error('Сервер не вернул комментарий');
		// теперь нужно изменить какой экшен будет диспатчиться при получении данных о посте. Заменяем res на data  и заменяем setPostData на экшен добавления одного комментария, его нужно создать в файле action-type.js
		// dispatch(setPostData(postData.res));
		dispatch(addComment(comment.data));
		return comment.data;
	});
};

// теперь обрабатываем этот экшен в редюсере post-reducer.js
