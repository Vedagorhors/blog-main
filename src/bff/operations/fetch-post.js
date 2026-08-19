// Получим комментарии. Здесь пользователь может читать комментарии без авторизации
// import { getComments, getPost } from '../api';

// export const fetchPost = async (postId) => {
// 	// делаем запрос в базу данных и передаем туда postId
// 	const post = await getPost(postId);

// 	// подгружаем комментарии
// 	const comments = await getComments(postId);

// 	return {
// 		error: null,
// 		res: {
// 			...post,
// 			comments,
// 		},
// 	};
// };

// Теперь  в папке api создаем запрос комментариев (файл get-comments.js) из базы данных

// Переписал код ниже. Изменения: дописал getUsers в импорт, добавил строку const users = await getUsers(); и обернул comments в .map(...), чтобы к каждому комментарию добавить author — логин автора вместо authorId.

import { getComments, getPost, getUsers } from '../api';
export const fetchPost = async (postId) => {
	// 	// делаем запрос в базу данных и передаем туда postId
	const post = await getPost(postId);
	// получаем все комментарии
	const comments = await getComments(postId);
	// Получим юзеров, чтобы опередлить какому юзеру принадлежит комментарий
	const users = await getUsers();

	// получим комментарии с автором
	const commentsWithAuthor = comments.map((comment) => {
		const user = users.find(({ id }) => id === comment.authorId);
		return {
			...comment,
			author: user?.login,
		};
	});

	// console.log(commentsWithAuthor);

	return {
		error: null,
		res: {
			...post,
			comments: commentsWithAuthor,
		},
	};
};

// можно и так:
// return {
// 	error: null,
// 	res: {
// 		...post,
// 		comments: comments.map((comment) => ({
// 			...comment,
// 			author: users.find(({ id }) => id === comment.authorId)?.login,
// 		})),
// 	},
// };
