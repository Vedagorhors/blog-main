import { transformComment } from '../transformers';
// Получим комментарии по статье
// export const getComments = (postId) =>
// 	// нужно указать критерий, по которому нужно отобрать комментарии, а именно зададим postId. Теперь сервер отфильтрует только те комментарии, которые принадлежат нужной статье
// export const getComments = (postId) =>
// 	fetch(`http://localhost:3005/comments?post_id=${postId}`)
// 		.then((loadedComments) => loadedComments.json())
// 		.then((loadedComments) => loadedComments.map(transformComment));

// Меняем на следующий код. Причина: query-фильтр ?post_id=001 не работает — json-server превращает "001" в число 1 и сравнивает со строкой "001" в БД → всегда пустой массив.

// можно и так:
export const getComments = (postId) =>
	fetch('http://localhost:3005/comments')
		.then((loadedComments) => loadedComments.json())
		.then((comments) =>
			comments.filter(({ post_id }) => post_id === postId).map(transformComment),
		);
