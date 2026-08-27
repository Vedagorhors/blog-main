// Функция получения списка всех статей getPosts

import { transformPost } from '../transformers';

// Используем трансформер в запросе списка статей. Трансформер мы создали, чтобы можно было использовать в нескольких местах.
export const getPosts = () =>
	fetch('http://localhost:3005/posts')
		.then((loadedPosts) => loadedPosts.json())
		// мы получили список статей и теперь сделаем для него маппинг (используем метод map).
		// Наш трансформер является функцией для маппинга списка статей
		.then((loadedPosts) => loadedPosts && loadedPosts.map(transformPost));
