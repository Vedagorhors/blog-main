import { setPostData } from './set-post-data';

export const addCommentAsync = (requestServer, userId, postId, content) => (dispatch) => {
	// console.log('addCommentAsync', userId, postId, content);

	requestServer('addPostComment', userId, postId, content).then((postData) => {
		dispatch(setPostData(postData.res));
	});
	// операция addPostComment нам должна вернуть обновленные данные по посту.
	// Создадим в папке operations файл add-post-comment.js
	// Создадим в папке action экшен setPostData в файле set-post-data.js
	// запрашиваем сервер, запрос на сервер делаем. Но для этого нужно в файле post.jsx передать в параметры еще requestServer  от нашего кастомного хука useServerRequest и там в файле вызовем хук: 	const requestServer = useServerRequest();
};
