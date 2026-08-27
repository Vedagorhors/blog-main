import { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Header, Footer, Modal } from './components';
import { Authorization, Main, Post, Registration, Users } from './pages';
import { setUser } from './actions';
import styled from 'styled-components'; // вместо CSS-модулей здесь будем использовать Styled-components, просто для примера, потому что ранее в уроках мы использовали только css-модули

const AppColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 1000px;
	min-height: 100%;
	margin: 0 auto;
	background-color: #fff;
`;

// Создаем стилизованный компонент Div просто для проверки. То есть обращаемся к объекту styled, который мы импортировали, потом через точку пишет тэг какой мы хотим использовать, который будет в основе стилизованного компонента. То есть получается был тэг, а стал компонент Div со стилями
// Вызываем функцию с помощью строкового шаблона (бэктики `` обозначают строковый шаблон) и когда мы бэктики пишем вплотную к переменной (div) это означает, что мы вызываем эту функцию. Вот div это у нас функция, которая находится в объекте styled. Так вот мы вызываем эту функцию и передаем в неё определённые аргументы, которые содержат текст из строкового шаблона и переменные, если мы их используем. Эта функция выполняется и что-то нам возвращает, в данном случае возвращает стилизованный компонент Blog.
const Page = styled.div`
	padding: 120px 0 20px;
`;

// const H2 = styled.h2`
// 	text-align: center;
// `; - мы убрали H2

// const Footer = () => <div>Футер</div>; // делал заглушку сначала

export const Blog = () => {
	const dispatch = useDispatch();
	// Данные, что в файле user-reducer.js в константе const initialUserState должны храниться в sessionStorage и когда мы заходим на страничку, они должны перегружаться
	// Как только мы заходим на страничку, мы сразу должны выполнить useLeyoutEffect.
	// useLeyoutEffect - это эффект, который не ждет отрисовки разметки и сразу совершает действие. А вот обычный useEffect ждет пока вся разметка  отрисуется, а затем он только запуститься. Но если мы его сейчас применим, то у нас сначала что-то мелькнет, а затем мы авторизуемся - нам так не нужно
	useLayoutEffect(() => {
		// получаем текущие пользовательские данные currentUserDataJSON в формате JSON (эти данные мы получаем из файлов authorization.jsx и registration.jsx), то есть считываем текущую авторизацию пользователя из sessionStorage из браузера, который не стирается при обновлени вкладки, это его особенность, а это значит, что нам еще нужно записывать туда данные когда мы авторизовались и стирать, когда мы выходим.
		const currentUserDataJSON = sessionStorage.getItem('userData');
		// проверяем что там есть. Если ничего нет, то ничего не делаем. Но если там что-то есть, то мы должны это закинуть в reduct store
		if (!currentUserDataJSON) {
			return;
		}

		//  А теперь получим нормальные данные currentUserData уже без формата JSON
		const currentUserData = JSON.parse(currentUserDataJSON);
		// сейчас в браузере в девтулз в консоли мы получим ошибку, так как в sessionStorage остались старые данные и их нужно обнулить. Прямо там в девтулз в консоли пишем sessionStorage.removeItem('userData') и энтер, затем также обнуляем хэш, пишем sessionStorage.removeItem('hash') и потом проверяем, что мы все обнулили - пишем просто sessionStorage и в ответ должны получить Storage {Length: 0}, что значит мы все обнулили в sessionStorage. Но у меня там появилось что-то и длина length = 1, а не 0. Я проигнорировал

		dispatch(
			setUser({
				// так как у нас не все данные являются строкой, вот roleId должно быть числом, поэтому мы не можем просто закинуть туда currentUserData, нужно сначала его развернуть, то есть получим всё, что там есть, а потом берем и оборачиваем currentUserData в Number и теперь все будет валидно.
				...currentUserData,
				roleId: Number(currentUserData.roleId),
			}),
		);
	}, [dispatch]);
	return (
		<AppColumn>
			<Header />
			<Page>
				{/* <H2>Контент страницы</H2> - уже не нужен заголовок. делал просто для наглядности */}
				<Routes>
					<Route path="/" element={<Main />} />
					{/* <Route path="/login" element={<div>Авторизация</div>} /> - это была сначала заглушка, пока мы не создали компонент авторизации Authorization */}
					<Route path="/login" element={<Authorization />} />
					{/* <Route path="/register" element={<div>Регистрация</div>} /> */}
					{/* после того, как создали компонент Registration, импортируем его в этот файли подставляем вместо заглушки: */}
					<Route path="/register" element={<Registration />} />
					<Route path="/users" element={<Users />} />
					{/* Для страницы новой статьи также используем {<Post />}. Нам это тоже подойдет, мы его же использовали и для редактирования статьи. А подойдет, потому что Новая статья также похожа на страницу редактирования, только начинаем мы не сзаполненных полей, а с пустых */}
					<Route path="/post" element={<Post />} />
					<Route path="/post/:id" element={<Post />} />
					<Route path="/post/:id/edit" element={<Post />} />
					<Route path="*" element={<div>Ошибка</div>} />
				</Routes>
			</Page>
			<Footer />
			{/* разместим модальное окно под футером, но окно все равно будет разешщаться поверх всего контента. По сути можно его здесь в любое место разметки поместить */}
			<Modal />
		</AppColumn>
	);
};
