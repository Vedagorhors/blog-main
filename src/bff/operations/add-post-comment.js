import { addComment, getPost } from '../api';
import { sessions } from '../sessions';
import { ROLE } from '../constants';
import { getPostCommentsWithAuthor } from '../utils';

// addPostComment - функция добавления комментария к статье
export const addPostComment = async (hash, userId, postId, content) => {
	// для этого метода fetchUsers должен быть свой список ролей, которые могут запросить роли. Получается для каждого метода будем задавать это массив  с ролями доступа accessRoles и таким образом будем проверять доступ
	const accessRoles = [ROLE.ADMIN, ROLE.MODERATOR, ROLE.READER];
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
	// здесь postId  нам нужен только для того, чтобы обновить информацию о посте
	await addComment(userId, postId, content);

	// загружаю статью (post)
	const post = await getPost(postId);

	// получаем все комментарии
	// const comments = await getComments(postId); // - это уже есть в отдельной утилите getPostCommentsWithAuthor
	// Получим юзеров, чтобы опередлить какому юзеру принадлежит комментарий
	// const users = await getUsers(); // - это уже есть в отдельной утилите getPostCommentsWithAuthor

	// получим комментарии с автором с помощью вынесенной в отдульную утилиту функции getPostCommentsWithAuthor
	const commentsWithAuthor = await getPostCommentsWithAuthor(postId);

	// выводим информацию о статье уже вместе с комментариями
	return {
		error: null,
		res: {
			...post,
			comments: commentsWithAuthor,
		},
	};
};

// Переписал код ниже. Изменения: дописал getUsers в импорт, добавил строку const users = await getUsers(); и обернул comments в .map(...), чтобы к каждому комментарию добавить author — логин автора вместо authorId.

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
// };
