import { Routes, Route } from 'react-router-dom';
import { Header } from './components';
import styled from 'styled-components'; // вместо CSS-модулей здесь будем использовать Styled-components, просто для примера, потому что ранее в уроках мы использовали только css-модули

const AppColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-bitween;
	width: 1000px;
	min-height: 100%;
	margin: 0 auto;
	background-color: #fff;
`;

// Создаем стилизованный компонент Div просто для проверки. То есть обращаемся к объекту styled, который мы импортировали, потом через точку пишет тэг какой мы хотим использовать, который будет в основе стилизованного компонента. То есть получается был тэг, а стал компонент Div со стилями
// Вызываем функцию с помощью строкового шаблона (бэктики `` обозначают строковый шаблон) и когда мы бэктики пишем вплотную к переменной (div) это означает, что мы вызываем эту функцию. Вот div это у нас функция, которая находится в объекте styled. Так вот мы вызываем эту функцию и передаем в неё определённые аргументы, которые содержат текст из строкового шаблона и переменные, если мы их используем. Эта функция выполняется и что-то нам возвращает, в данном случае возвращает стилизованный компонент Blog.
const Content = styled.div`
	padding: 120px 0;
`;

const H2 = styled.h2`
	text-align: center;
`;

const Footer = () => <div>Футер</div>;

export const Blog = () => {
	return (
		<AppColumn>
			<Header />
			<Content>
				<H2>Контент страницы</H2>
				<Routes>
					<Route path="/" element={<div>Главная страница</div>} />
					<Route path="/login" element={<div>Авторизация</div>} />
					<Route path="/register" element={<div>Регистрация</div>} />
					<Route path="/users" element={<div>Пользователи</div>} />
					<Route path="/post" element={<div>Новая статья</div>} />
					<Route path="/post/:postId" element={<div>Статья</div>} />
					<Route path="*" element={<div>Ошибка</div>} />
				</Routes>
			</Content>
			<Footer />
		</AppColumn>
	);
};
