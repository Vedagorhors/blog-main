// создадим асинхронный экшен, который позволит диспатчить другие экшены обычные, синхронные

import { setPostData } from './set-post-data';

// Асинхронные экшены лучше именовать со словом async
export const loadPostAsync = (requestServer, postId) => (dispatch) =>
	// вызываем requestServer и обращаемся к операции, назовем её fetchPost и еще передадим postId. Когда данные вернуться, мы вызовем dispatch и отправим синхронный экшен setPostData, который установит в redux store данные о статье
	// console.log(postId);

	requestServer('fetchPost', postId).then((postData) => {
		// console.log(postData);
		// при реализации страницы с ошибкой пришли к выводу, что здесь postData нужно передавать дальше, а установку статьи setPostData нужно делать только тогда, когда есть данные и нет ошибки. То есть либо есть данные либо есть ошибка. postData имеет два свойства res и error. Если есть результат, то отправим данные в redux store, запишем их в статью и влюбом случае вернем postData, чтобы мы потом могли обработать эти данные. Теперь обработаем в файле post.js
		if (postData.res) {
			dispatch(setPostData(postData.res));
		}
		return postData;
	});
// создадим в папке action экшен setPostData в файле set-post-data
// запрашиваем сервер, запрос на сервер делаем. Но для этого нужно в файле post.jsx передать в параметры еще requestServer  от нашего кастомного хука useServerRequest и там в файле вызовем хук: 	const requestServer = useServerRequest();

// дальше обработаем в редюсере в файле post-reducer
