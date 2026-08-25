// запрос (обращение) в базу данных для осуществления удаления статьи

// Выполняем действия по удалению статьи. По postId нашли нужную статью и удалили её
export const deletePost = (postId) =>
	fetch(`http://localhost:3005/posts/${postId}`, {
		// удалим данные с помощью метода DELETE
		method: 'DELETE',
	});
