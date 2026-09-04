// Пагинация – переключение по страницам.
// JSON сервер позволяет использовать Пагинацию. На сайте github.com/typicode/json-server#paginate написано про пагинацию и оттуда мы возьмем необходимы данные как использовать пагинацию в нашем случае
// // часть кода пагинации пишем в файле fetch-posts.js в запросе статей, а точнее в файле get-posts.js. В файле main.jsx мы должны передать страницу page  и limit (количество статей на странице). Также создали константу в файле pagination-limit.js в папке constants

import PropTypes from 'prop-types';
import { Button } from '../../../../components';
import styled from 'styled-components';

const PaginationContainer = ({ className, page, lastPage, setPage }) => {
	return (
		<div className={className}>
			{/* на кнопку мы вешаем онклик и вызываем функцию setPage с нужным числом. Кнопка "В начало", значит на первую страницу, вот и указываем setPage(1).
			Для кнопок вводим disabled, то есть кнопки В начало и Предыдущая будут неактивны, когда мы нахоодимся на первой страницу, то есть page === 1. В файле button.jsx делаем стилизацию кнопки, меняем в зависимости от disabled вид курсора стрелка или рука */}
			<Button disabled={page === 1} onClick={() => setPage(1)}>
				В начало
			</Button>
			<Button disabled={page === 1} onClick={() => setPage(page - 1)}>
				Предыдущая
			</Button>
			<div className="current-page">Страница: {page}</div>
			{/* здесь используем значчение lastPage. Когда page === lastPage эти две кнопки будут заблокированы (неактивные), потому что дальше листать некуда, достигнута последняя страница. Также здесь lastPage прилетает в setPage, когда мы нажимаем кнопку В конец */}
			<Button disabled={page === lastPage} onClick={() => setPage(page + 1)}>
				Следующая
			</Button>
			<Button disabled={page === lastPage} onClick={() => setPage(lastPage)}>
				В конец
			</Button>
		</div>
	);
};

export const Pagination = styled(PaginationContainer)`
	display: flex;
	justify-content: center;
	position: absolute;
	bottom: 140px;
	width: 100%;
	margin: 0 0 20px;
	padding: 0 35px;

	& button {
		margin: 0 5px;
	}

	& .current-page {
		width: 100%;
		height: 32px;
		margin: 0px 5px;
		font-size: 18px;
		font-weight: 500;
		line-height: 26px;
		text-align: center;
		border: 1px solid #000;
	}
`;

Pagination.propTypes = {
	page: PropTypes.number.isRequired,
	lastPage: PropTypes.number.isRequired,
	setPage: PropTypes.func.isRequired,
};
