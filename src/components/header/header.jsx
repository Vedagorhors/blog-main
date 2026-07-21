import { ControlPanel, Logo } from './components';
import styled from 'styled-components';

const Discription = styled.div`
	font-style: italic;
`;

const HeaderContainer = ({ className }) => (
	<header className={className}>
		<Logo />
		<Discription>
			Веб-технологии
			<br />
			Написание кода
			<br />
			Разбор ошибок
		</Discription>
		<ControlPanel />
	</header>
);

// Чтобы стили применить к компоненту необходимо styled использовать не как объект, а как функцию и передать в аргументы тот компонент, который хотим стилизовать, то шапку Header. Создадим стилизованную шапку. Чтобы контент главной страницы при прокрутке уходил под шапку header, нужно задать белую заливку (background-color: #fff;)
export const Header = styled(HeaderContainer)`
	display: flex;
	justify-content: space-between;
	position: fixed;
	top: 0;
	width: 1000px;
	height: 120px;
	padding: 20px 40px;
	background-color: #fff;
	box-shadow: 0px -2px 17px #000;
`;
