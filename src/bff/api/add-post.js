// создадим новую статью тем свмым добавив её в базу данных в db.json. Выполним запрос для записи с методом POST. То есть на страницу в новую статью  мы добавляем новые данные body...
import { generateDate } from '../utils';

// В addPost мы принимаем newPostData  и тут же из неё мы достаем данные imageUrl, title, content
export const addPost = (imageUrl, title, content) =>
	fetch('http://localhost:3005/posts', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		// ниже id указывать не нужно, он создасться автоматически. Также нужно преобразовать из JSON
		body: JSON.stringify({
			image_url: imageUrl,
			published_at: generateDate(),
			title,
			content,
		}),
	}).then((createdPost) => createdPost.json());
