import { Pagination, PostCard, Search } from './components';
import { useEffect, useMemo, useState } from 'react';
import { useServerRequest } from '../../hooks';
import { PAGINATION_LIMIT } from '../../bff/constants';
import { debounce } from './utils/debounce';
import styled from 'styled-components';

const MainContainer = ({ className }) => {
	// список статей будем хранить в локальном стейте по аналогии с пользователями. Потому что нет смысла выносить эти данные в redux store, оставим эти данные внутри компонента, так как эти данные, список статей не покинут пределы компонента и нигде, кроме как на главной странице, они использоваться не будут. Только на главной мы отрисуем их перечень и по клику на какую-нибудь статью мы будем переходить на её страницу
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	// Число последней страницы будем держать в стейте, потому что, если число измениться, то нужно пагинацию перерисовать. setLastPage укажем ниже, а lastPage передадим в пропсы в компонент Pagination. Далее смотри файл pagination.jsx
	const [lastPage, setLastPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);
	// Получаем саму функцию requestServer с помощью кастомного хука useServerRequest
	const requestServer = useServerRequest();
	// возвращаем список статей, который мы получим с помощью загрузки с сервера. Загружать будем с помощью хука useEffect. Загрузку производим только один раз, при монтировании компонента.
	// Сначала у нас пустой массив, когда данные загрузятся, мы будем делать setPosts и подставлять результат.
	useEffect(() => {
		// для реализации пагинации мы должны передать здесь страницу page  и limit (количество статей на странице), а брать эти параметры, а именно page мы будем из состояния (см выше), а limit возьмем из константы PAGINATION_LIMIT (создаем файл pagination-limit.js в папке constants), это такое значение, которое в процессе работы приложения меняться не будет, но можно менять его конфигурацию очень редко. Зздесь указываем PAGINATION_LIMIT вместо limit. Вообще эта константа может храниться как на фронтенде, так и на бекенде, потому что она редко меняющаяся, скорее как конфигурация. Мы разместим на фронтенде.
		// Как это работает - page  мы передаем в запрос на сервер и нам возвращаются соответствующие статьи на нужной странице, а для этого нужно, чтобф useEffect обновлялся когда меняется page (добавляем page в массив зависимостей). Устанавливать новые страницы, а значит вызывать setPage  мы будем в компоненте Pagination, там будут кнопки и при нажатии на которые будет вызываться setPage c соответвестствующим числом. Здесь ниже преедаем в компонент Pagination проп setPage и потом принимаем его уже в самом компоненте Pagination.
		// Итак, здесь у нас запрос на сервер (requestServer), а в .then((posts) мы получаем ответ. посты (статьи) приходят. Соответственно с запросом fetchPosts приходят и ссылки, но они находятся в заголовках и нам нужно их оттуда достать. Получается что здесь мы будем получать информацию о последней странице. Число последней страницы будем держать в стейте (см. выше), потому что, если число измениться, то нужно пагинацию перерисовать.
		requestServer('fetchPosts', searchPhrase, page, PAGINATION_LIMIT).then(
			({ res: { posts, lastPage } }) => {
				// делаем запрос с помощью операции fetchPosts. Принимаем ответ. Ошибки здесь быть не может, у нас всегда доступна эта операция, поэтому проверку по условию делать не нужно, что мол если ошибка, то ... Так как ошибки нет, то мы устанавиливаем список постов статей
				setPosts(posts);
				// console.log(lastPage);

				setLastPage(lastPage);
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [requestServer, page, shouldSearch]);

	// при каждом рендере startDelayedSearch будет выполняться. debounce вернет функцию
	const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

	// На данный момент на каждый набранный символ в поле поиска срабатывает onSearch, поэтому нужно функцию setShouldSearch как бы прогнать через debounce. Создадим утилиту debounce в папке main\utils
	const onSearch = ({ target }) => {
		setSearchPhrase(target.value);
		setPage(1); // при новом поиске всегда начинаем с 1-й страницы
		// Дальше searchPhrase должны принять в файле fetch-posts, затем по цепочке в get-posts
		// По условию ТЗ через 2сек после того как написали текст поиска нужно, чтобы поиск запустился автоматически. Используем функцию debounce, которая обеспечивает задержку
		startDelayedSearch(!shouldSearch);
	};

	return (
		// Выводим список статей. Сначала создадим обёртку div и нужно сюда пробросить className. Что мы будем рендерить? Мы берем на статьи posts и делаем map, то есть проходим по списку статей, как мы делали и для пользователей.
		// Данные id, title, publishedAt, commentsCount мы будем получать при обращении на сервере к операции fetchPosts.
		// Каждая карточка статьи будет отдельным компонентом PostCard - это хорошая практика.
		<div className={className}>
			<div className="posts-and-search">
				<Search searchPhrase={searchPhrase} onChange={onSearch} />
				{/* здесь будет список статей, а над ним будет поле поиска, а под ним будет пагинация.
			Делаем условный рендеринг - смотрим длину posts и если длина есть, то рендерим это, иначе Выдаем сообщение: Статьи не найдены. Нужно обязательно писать > 0, так как ноль рендерится, а не рендкрится только boolean */}
				{posts.length > 0 ? (
					<div className="post-list">
						{posts.map(
							({ id, title, imageUrl, publishedAt, commentsCount }) => (
								<PostCard
									key={id}
									id={id}
									title={title}
									imageUrl={imageUrl}
									publishedAt={publishedAt}
									commentsCount={commentsCount}
								/>
								// Теперь созадим компонент PostCard в отдельном файле post-card.jsx
							),
						)}
					</div>
				) : (
					<div className="no-posts-found">Статьи не найдены</div>
				)}
			</div>
			{/* Если страниц со статьями у нас всего одна, то нужно скрывать кнопки пагинации. Если страниц больше одной и страницы больше нуля, то мы показываем кнопки пагинации иначе не показываем */}
			{lastPage > 1 && posts.length > 0 && (
				<Pagination page={page} lastPage={lastPage} setPage={setPage} />
			)}
		</div>
	);
};

// Теперь сделаем операцию fetchPosts в отдельном файле fetch-posts.js, чтобы данные выводились и мы могли верстать

export const Main = styled(MainContainer)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	& .post-list {
		display: flex;
		flex-wrap: wrap;
		padding: 20px 20px 80px;
	}

	& .no-posts-found {
		font-size: 18px;
		margin-top: 40px;
		text-align: center;
	}
`;
