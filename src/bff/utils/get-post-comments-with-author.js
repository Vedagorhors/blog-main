// Утилита getPostCommentsWithAuthor будет обращаться в базу данных, а значит эта функция асинхронная

import { getComments, getUsers } from '../api';

export const getPostCommentsWithAuthor = async (postId) => {
	// получаем все комментарии
	const comments = await getComments(postId);
	// Получим юзеров, чтобы опередлить какому юзеру принадлежит комментарий
	const users = await getUsers();

	// получим комментарии с автором
	return comments.map((comment) => {
		const user = users.find(({ id }) => id === comment.authorId);
		return {
			...comment,
			author: user?.login,
		};
	});
};
