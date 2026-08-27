import { PostCard } from './components';
import { useEffect, useState } from 'react';
import { useServerRequest } from '../../hooks';
import styled from 'styled-components';

const MainContainer = ({ className }) => {
	// список статей будем хранить в локальном стейте по аналогии с пользователями. Потому что нет смысла выносить эти данные в redux store, оставим эти данные внутри компонента, так как эти данные, список статей не покинут пределы компонента и нигде, кроме как на главной странице, они использоваться не будут. Только на главной мы отрисуем их перечень и по клику на какую-нибудь статью мы будем переходить на её страницу
	const [posts, setPosts] = useState([]);
	// Получаем саму функцию requestServer с помощью кастомного хука useServerRequest
	const requestServer = useServerRequest();
	// возвращаем список статей, который мы получим с помощью загрузки с сервера. Загружать будем с помощью хука useEffect. Загрузку производим только один раз, при монтировании компонента.
	// Сначала у нас пустой массив, когда данные загрузятся, мы будем делать setPosts и подставлять результат.
	useEffect(() => {
		requestServer('fetchPosts').then((posts) => {
			// делаем запрос с помощью операции fetchPosts. Принимаем ответ. Ошибки здесь быть не может, у нас всегда доступна эта операция, поэтому проверку по условию делать не нужно, что мол если ошибка, то ... Так как ошибки нет, то мы устанавиливаем список постов статей
			setPosts(posts.res);
		});
	}, [requestServer]);

	return (
		// Выводим список статей. Сначала создадим обёртку div и нужно сюда пробросить className. Что мы будем рендерить? Мы берем на статьи posts и делаем map, то есть проходим по списку статей, как мы делали и для пользователей.
		// Данные id, title, publishedAt, commentsCount мы будем получать при обращении на сервере к операции fetchPosts.
		// Каждая карточка статьи будет отдельным компонентом PostCard - это хорошая практика.
		<div className={className}>
			{/* здесь будет список статей, а над ним будет поле поиска, а под ним будет пагинация */}
			<div className="post-list">
				{posts.map(({ id, title, imageUrl, publishedAt, commentsCount }) => (
					<PostCard
						key={id}
						id={id}
						title={title}
						imageUrl={imageUrl}
						publishedAt={publishedAt}
						commentsCount={commentsCount}
					/>
					// Теперь созадим компонент PostCard в отдельном файле post-card.jsx
				))}
			</div>
		</div>
	);
};

// Теперь сделаем операцию fetchPosts в отдельном файле fetch-posts.js, чтобы данные выводились и мы могли верстать

export const Main = styled(MainContainer)`
	& .post-list {
		display: flex;
		flex-wrap: wrap;
		padding: 20px;
	}
`;
