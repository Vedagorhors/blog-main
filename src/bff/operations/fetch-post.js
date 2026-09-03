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

import { getPost } from '../api';
import { getPostCommentsWithAuthor } from '../utils';

export const fetchPost = async (postId) => {
	// перехватываем ошибку с помощью catch
	let post;
	let error;

	try {
		// делаем запрос в базу данных и передаем туда postId
		post = await getPost(postId);
	} catch (postError) {
		error = postError;
	}

	// если есть ошибка, значит нет response
	if (error) {
		return {
			error,
			res: null,
		};
	}

	// получаем все комментарии
	// const comments = await getComments(postId); // - это уже есть в отдельной утилите getPostCommentsWithAuthor
	// Получим юзеров, чтобы опередлить какому юзеру принадлежит комментарий
	// const users = await getUsers(); // - это уже есть в отдельной утилите getPostCommentsWithAuthor

	// получим комментарии с автором с помощью вынесенной в отдульную утилиту функции getPostCommentsWithAuthor
	const commentsWithAuthor = await getPostCommentsWithAuthor(postId);

	// console.log(commentsWithAuthor);

	// в res (это responce) мы отправляем данные о посте (статье), а ошибка null
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
