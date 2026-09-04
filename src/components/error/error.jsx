// Создадим компонент Error (скопировали код с подобного файла content.jsx)

// import PropTypes from 'prop-types'; // - так как мы отдельно сделали константу с типизацией, то здесь не понадобился этот импорт
import { H2 } from '../h2/h2';
import styled from 'styled-components';
import { PROP_TYPE } from '../../constants';

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

Error.propTypes = {
	// взяли типизацию из файла prop-type.js константы ERROR
	error: PROP_TYPE.ERROR,
};
//этот компонент Error будем теперь использовать и в файле content.jsx
