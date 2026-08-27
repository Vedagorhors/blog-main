import { transformComment } from '../transformers';
// Получаем комментарии по postId
// export const getComments = (postId) =>
// 	// нужно указать критерий, по которому нужно отобрать комментарии, а именно зададим postId. Теперь сервер отфильтрует только те комментарии, которые принадлежат нужной статье
// export const getComments = (postId) =>
// 	fetch(`http://localhost:3005/comments?post_id=${postId}`)
// 		.then((loadedComments) => loadedComments.json())
// 		.then((loadedComments) => loadedComments.map(transformComment));

// Ранее здесь мы получали комментарии по postId, но сейчас решили получать вообще все комментарии.
// Перепишем код по другому. Создадим переменную ALL_COMMENTS_URL. Её не нужно выносить в отдельный файл, так как она будет использоваться только в этом файле
const ALL_COMMENTS_URL = 'http://localhost:3005/comments';
// переменная комментария для конкретного поста. post_id= и потом в const url добавляем postId. Не пригодилась константа
// const POST_COMMENTS_URL = 'http://localhost:3005/comments?post_id=';

// Вариант 1 кода
// export const getComments = (postId) => {
// 	// подберем url исходя из того, что postId передан. Если postId не передан, то он будет undefined и запрос у него будет http://localhost:3005/comments, то есть подставим переменную ALL_COMMENTS_URL
// 	const url = postId === undefined ? ALL_COMMENTS_URL : POST_COMMENTS_URL + postId;
// 	return fetch(url)
// 		.then((loadedComments) => loadedComments.json())
// 		.then((loadedComments) => loadedComments.map(transformComment));
// };

// Меняем на следующий код. Причина: query-фильтр ?post_id=001 не работает — json-server превращает "001" в число 1 и сравнивает со строкой "001" в БД → всегда пустой массив.

// Вариант 2 кода
// export const getComments = (postId) => {
// 	// подберем url исходя из того, что postId передан. Если postId не передан, то он будет undefined и запрос у него будет http://localhost:3005/comments, то есть подставим переменную ALL_COMMENTS_URL
// 	const url = postId === undefined ? ALL_COMMENTS_URL : POST_COMMENTS_URL + postId;
// 	return fetch(url)
// 		.then((loadedComments) => loadedComments.json())
// 		.then((comments) =>
// 			comments.filter(({ post_id }) => post_id === postId).map(transformComment),
// 		);
// };

// после ошибок исправил на этот код (при вызове без postId не фильтрую). Всегда запрашиваю все комментарии и фильтрую на стороне BFF, по другому не получилось
export const getComments = (postId) =>
	fetch(ALL_COMMENTS_URL)
		.then((loadedComments) => loadedComments.json())
		.then((comments) =>
			(postId === undefined
				? comments
				: comments.filter(({ post_id }) => post_id === postId)
			).map(transformComment),
		);
