// Операция по удалению статьи. Напишем её на основе кода из файла remove-post-comment.js

import { deleteComment, getComments, getPost } from '../api';
import { sessions } from '../sessions';
import { ROLE } from '../constants';

// removePostComment - функция удаления комментария из статьи
export const removePostComment = async (hash, postId, id) => {
	// для этого метода fetchUsers должен быть свой список ролей, которые могут запросить роли. Получается для каждого метода будем задавать это массив  с ролями доступа accessRoles и таким образом будем проверять доступ. Здесь удалять комментарии могут только админ и модератор
	const accessRoles = [ROLE.ADMIN, ROLE.MODERATOR];
	// console.log('до проверки доступа addPostComment', userId, postId, content);

	// Проверяем доступ в сессиях, что у пользователя есть права на получение списка ролей. Это может делать только администратор. Если проверка не пройдена, то отправляем ошибку. (! - проверка провалилась)
	// Эту сессию userSession мы отправляем для проверки доступа, а также отправляем в нашу утилиту accessRoles (роли с доступом), то есть мы отправляем массив с теми ролями, для которых эта операция доступна, а это определяет сама операция, она знает для кого она доступна на сервере
	// Если доступа нет, то мы об этом сообщаем: error: 'Доступ запрещен'
	const access = await sessions.access(hash, accessRoles);
	// console.log('Результат проверки доступа:', access);

	if (!access) {
		return {
			error: 'Доступ запрещен',
			res: null,
		};
	}
	// console.log('После проверки доступа addPostComment', userId, postId, content);

	await deleteComment(id);

	// загружаю статью (post)
	const post = await getPost(postId);

	// подгружаем обновленные комментарии
	const comments = await getComments(postId);
	// const users = await getUsers();

	// Возвращаем обновленные данные о посте
	// await getPost(postId);

	// выводим информацию о статье уже вместе с комментариями
	return {
		error: null,
		res: {
			...post,
			comments,
		},
	};
};

// Теперь нужно создать запрос в базу данных, это будет deleteComment. Создадим в папке api файл delete-comment.js
