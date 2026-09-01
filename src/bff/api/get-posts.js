// Функция получения списка всех статей getPosts

import { transformPost } from '../transformers';

// Используем трансформер в запросе списка статей. Трансформер мы создали, чтобы можно было использовать в нескольких местах.
// Для реализации пагинации к адресу мы допишем те параметры _page  и _limit (параметр указывающий сколько статей у нас будет на одной странице) из документации про пагинацию для json-сервера, что мы смотрим здесь: github.com/typicode/json-server#paginate. Теперь параметры _page  и _limit нужно передать в операции в файле fetch-posts.js
// Добавим сюда еще критерий поиска searchPhrase на стадии реализации задачи поиска
export const getPosts = (searchPhrase, page, limit) =>
	fetch(
		`http://localhost:3005/posts?title_contains=${searchPhrase}&_page=${page}&_per_page=${limit}`,
	)
		.then((loadedPosts) => loadedPosts.json())
		.then((loadedPosts) => ({
			...loadedPosts,
			data: loadedPosts.data.map(transformPost),
		}));
