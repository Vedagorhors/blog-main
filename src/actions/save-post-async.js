// Экшен асинхронный для сохранения статьи.

import { setPostData } from './set-post-data';

// Этот экшен savePostAsync вернет нам этот запрос requestServer
export const savePostAsync = (requestServer, newPostData) => (dispatch) =>
	requestServer('savePost', newPostData).then((updatedPost) => {
		dispatch(setPostData(updatedPost.res));
	});
