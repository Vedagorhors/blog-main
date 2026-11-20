import { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Error, Header, Footer, Modal } from './components';
import { Authorization, Main, Post, Registration, Users } from './pages';
import { setUser } from './actions';
import { ERROR, ROLE } from './constants';
import styled from 'styled-components';

const AppColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	width: 1000px;
	min-height: 100%;
	margin: 0 auto;
	background-color: #fff;
`;

const Page = styled.div`
	padding: 120px 0 20px;
`;

export const Blog = () => {
	const dispatch = useDispatch();
	useLayoutEffect(() => {
		const currentUserDataJSON = sessionStorage.getItem('userData');
		if (currentUserDataJSON === null) {
			return;
		}

		try {
			const currentUserData = JSON.parse(currentUserDataJSON);
			// Старые попытки входа могли сохранить строку "undefined" или неполные данные.
			// Проверяем роль до преобразования: Number(null) и Number('') дают 0 (ADMIN).
			const savedRole = currentUserData?.roleId;
			const roleId =
				typeof savedRole === 'number' ||
				(typeof savedRole === 'string' && savedRole.trim() !== '')
					? Number(savedRole)
					: NaN;
			if (
				!currentUserData?.id ||
				typeof currentUserData.login !== 'string' ||
				!currentUserData.login ||
				![ROLE.ADMIN, ROLE.MODERATOR, ROLE.READER].includes(roleId)
			) {
				throw new Error('Некорректные сохранённые данные пользователя');
			}
			dispatch(setUser({ ...currentUserData, roleId }));
		} catch {
			// Удаляем только запись пользователя; остальные данные вкладки сохраняем.
			sessionStorage.removeItem('userData');
		}
	}, [dispatch]);
	return (
		<AppColumn>
			<Header />
			<Page>
				{}
				<Routes>
					<Route path="/" element={<Main />} />
					{}
					<Route path="/login" element={<Authorization />} />
					{}
					{}
					<Route path="/register" element={<Registration />} />
					<Route path="/users" element={<Users />} />
					{}
					{}
					<Route path="/post" element={<Post />} />
					<Route path="/post/:id" element={<Post />} />
					<Route path="/post/:id/edit" element={<Post />} />
					{}
					<Route path="*" element={<Error error={ERROR.PAGE_NOT_EXIST} />} />
				</Routes>
			</Page>
			<Footer />
			{}
			<Modal />
		</AppColumn>
	);
};
