// Экшен для удаления статьи

export const removePostAsync = (requestServer, id) => () =>
	// здесь синхронный экшен, для того, чтобы обновить данные поста
	// мы отправляем запрос на вот эту операцию removePost на сервере, передаем туда id на удаление статьи
	requestServer('removePost', id);
// операция removePost нам должна вернуть обновленные данные по посту.
// Создадим в папке operations файл remove-post.js
