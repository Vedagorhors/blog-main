// Добавим новый комментарий в базу данных в db.json. Выполним запрос для записи с методом POST. То есть на страницу в comments  мы добавляем новые данные body...
import { generateDate } from '../utils';

export const addComment = (userId, postId, content) =>
	fetch('http://localhost:3005/comments', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			author_id: userId,
			post_id: postId,
			published_at: generateDate(),
			content,
		}),
	});
