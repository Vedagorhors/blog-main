// Экшен для удаления комментария

import { setPostData } from './set-post-data';

export const removeCommentAsync = (requestServer, postId, id) => (dispatch) => {
	// здесь синхронный экшен, для того, чтобы обновить данные поста
	// мы отправляем запрос на вот эту операцию removePostComment на сервере, передаем туда id на удаление комментария и принимаем обновленные данные этого поста postData
	requestServer('removePostComment', postId, id).then((postData) => {
		dispatch(setPostData(postData.res));
	});
	// операция removePostComment нам должна вернуть обновленные данные по посту.
	// Создадим в папке operations файл remove-post-comment.js
	// Ранее уже создали в папке action экшен setPostData в файле set-post-data
};
