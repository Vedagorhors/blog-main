import { request } from '../utils/request';
import { setPostData } from './set-post-data';

export const loadPostAsync = (postId, isCurrent = () => true) => (dispatch) =>
	// requestServer('fetchPost', postId).then((postData) => {
	request(`/posts/${postId}`).then((postData) => {
		if (!postData.data?.id) throw new Error('Сервер не вернул статью');
		if (isCurrent()) {
			dispatch(setPostData(postData.data));
		}
		return postData;
	});
