// Утилита подсчета количества комментариев
// перестахуемся и зададим comments = [], чтобы фильтр всегда сработал
export const getCommentsCount = (comments = [], postId) => {
	const postComments = comments.filter(
		({ postId: commentPostId }) => commentPostId === postId,
	);
	// тепеь у нас есть комментарии этого поста и мы можем вернуть их количество
	return postComments.length;
};
