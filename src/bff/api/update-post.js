// updatePost - обращение в базу данных для обновления статьи
// Здесь уже раскрываем данные6 которые принимаем id, imageUrl, title, content
export const updatePost = (id, imageUrl, title, content) =>
	// обращаемся по id (к конкретному посту) в таблицу с постами для записи по адресу .../posts,
	fetch(`http://localhost:3005/posts/${id}`, {
		// обновим данные с помощью метода PATCH. Метод позволяет обновить не все данные, а выборочно. В метод передаем новые данные о пользователе
		method: 'PATCH',
		// укажем заголовки и кодировку
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			// для подсказки смотрю в базу данных (БД) в файл db.json в posts и вижу какие данные ниже нужно вписать (image_url: imageUrl, title, content)
			image_url: imageUrl,
			title,
			content,
		}),
	}).then((loadedPost) => loadedPost.json());
