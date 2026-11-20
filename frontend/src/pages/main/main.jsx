import { Pagination, PostCard, Search } from './components';
import { useEffect, useState } from 'react';
// import { useServerRequest } from '../../hooks';
import { PAGINATION_LIMIT } from '../../constants';
// import { debounce } from './utils/debounce'; — раньше откладывали переключатель shouldSearch.
import styled from 'styled-components';
import { request } from '../../utils/request';

const MainContainer = ({ className }) => {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	// Вместо переключателя shouldSearch откладываем само значение поискового запроса.
	const [delayedSearch, setDelayedSearch] = useState('');
	const [loadResult, setLoadResult] = useState(null);
	const query = new URLSearchParams({ search: delayedSearch, page, limit: PAGINATION_LIMIT }).toString();
	const isLoading = loadResult?.query !== query;
	const error = isLoading ? null : loadResult.error;

	useEffect(() => {
		const timer = setTimeout(() => setDelayedSearch(searchPhrase), 2000);
		return () => clearTimeout(timer);
	}, [searchPhrase]);
	// const requestServer = useServerRequest();
	useEffect(() => {
		let active = true;
		// requestServer('fetchPosts', ...) — прежний вызов через bff.
		// URLSearchParams сохраняет &, +, # и другие символы внутри поискового значения.
		request(`/posts?${query}`)
			.then(({ data }) => {
				if (!active) return;
				setPosts(data.posts);
				setLastPage(data.lastPage);
				setLoadResult({ query, error: null });
			})
			.catch((error) => { if (active) setLoadResult({ query, error: error.message }); });
		// Ответ предыдущего запроса не должен перезаписать результаты нового поиска.
		return () => { active = false; };
	}, [query]);

	const onSearch = ({ target }) => {
		setSearchPhrase(target.value);
		setPage(1);
	};

	return (
		<div className={className}>
			<div className="posts-and-search">
				<Search searchPhrase={searchPhrase} onChange={onSearch} />
				{}
				{error ? (
					<div role="alert">Ошибка загрузки статей: {error}</div>
				) : isLoading ? (
					<div role="status">Загрузка статей...</div>
				) : posts.length > 0 ? (
					<div className="post-list">
						{posts.map(({ id, title, imageUrl, publishedAt, comments }) => (
							<PostCard
								key={id}
								id={id}
								title={title}
								imageUrl={imageUrl}
								publishedAt={publishedAt}
								commentsCount={comments.length}
							/>
						))}
					</div>
				) : (
					<div className="no-posts-found">Статьи не найдены</div>
				)}
			</div>
			{}
			{!error && !isLoading && lastPage > 1 && posts.length > 0 && (
				<Pagination page={page} lastPage={lastPage} setPage={setPage} />
			)}
		</div>
	);
};

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
