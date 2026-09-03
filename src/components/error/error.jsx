// Создадим компонент Error (скопировали код с подобного файла content.jsx)
import { H2 } from '../h2/h2';
import styled from 'styled-components';

const Div = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 18px;
`;

// children здесь не нужен, как был в content.jsx, так как children нужен, когда мы контент выводим, а если выводиться ошибка, то нужно её просто отрендерить
export const Error = ({ error }) =>
	// если есть ошика6 то мы её отображаем
	error && (
		<Div>
			<H2>Ошибка</H2>
			<div>{error}</div>
		</Div>
	);

//этот компонент Error будем теперь использовать и в файле content.jsx
