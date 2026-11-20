import { request } from '../utils/request';
import { removeComment } from './remove-comment';
// import { setPostData } from './set-post-data';

// Интеграция фронтенда с бэкендом. Убираем requestServer
export const removeCommentAsync = (postId, id) => (dispatch) => {
	// requestServer('removePostComment', postId, id).then((postData) => {
	return request(`/posts/${postId}/comments/${id}`, 'DELETE').then(() => {
		// dispatch(setPostData(postData.res));
		dispatch(removeComment(id));
	});
};
