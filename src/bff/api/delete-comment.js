// Запрос в базу данных по поводу удаления комментария
// import { getSession } from './get-session';

export const deleteComment = async (commentId) =>
	fetch(`http://localhost:3005/comments/${commentId}`, {
		// удалим комментарий с помощью метода DELETE
		method: 'DELETE',
	});

// теперь всё это нужно использовать для управления комментариями. Исправляем в файле sessions.js - удаляем list: {},
