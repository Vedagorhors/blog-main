// создадим асинхронный экшен, который позволит диспатчить другие экшены обычные, синхронные

import { setPostData } from './set-post-data';

// Асинхронные экшены лучше именовать со словом async
export const loadPostAsync = (requestServer, postId) => (dispatch) => {
	// вызываем requestServer и обращаемся к операции, назовем её fetchPost и еще передадим postId. Когда данные вернуться, мы вызовем dispatch и отправим синхронный экшен setPostData, который установит в redux store данные о статье
	// console.log(postId);

	requestServer('fetchPost', postId).then((postData) => {
		// console.log(postData);

		dispatch(setPostData(postData.res));
	});
	// создадим в папке action экшен setPostData в файле set-post-data
	// запрашиваем сервер, запрос на сервер делаем. Но для этого нужно в файле post.jsx передать в параметры еще requestServer  от нашего кастомного хука useServerRequest и там в файле вызовем хук: 	const requestServer = useServerRequest();
};
// дальше обработаем в редюсере в файле post-reducer
