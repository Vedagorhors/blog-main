// выполним типизацию с помощью PropTypes. Скопируем импорт PropTypes и сразу вставим его во все компоненты, которые потом будем типизировать, чтобы не искать потом - сразу откроем эти файлы и потом просто будем брать компонент где есть импорт import PropTypes и будем типизировать не отвлекаясь на поиски.

import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonContainer = ({ children, className, width, ...props }) => {
	return (
		<button className={className} {...props}>
			{/* передадим дочерние элементы children. В чилдрен у нас слово Авторизоваться */}
			{children}
		</button>
	);
};

// курсор для кнопок пагинации делаем так: принимаем disabled и если он тру, то кнопка будкет ввиде стрелки, а если он фалсе, то кнопка в виде руки. Это чтобы при наведении на неактивные кнопки курсор должен быть просто стрелкой, то есть default
export const Button = styled(ButtonContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	width: ${({ width = '100%' }) => width};
	height: 32px;
	border: 1px solid rgb(0, 0, 0);
	background-color: rgb(238, 238, 238);

	&:hover {
		cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
	}
`;

// className  не типизируется, потому что когда мы создаем styled-components, то внешний компонент Button у нас стилизованный, то есть тот компонент, который идет вовне для использования. Вот как раз этот внешний компонент и важен, важно какие пропсы в него передают, а в него className передавать не будут. className используется только для того, чтобы заработали styled-components и для внешнего мира проп className не передается для каких-то внешних компонентов, где мы будем использовать Button.
// То есть мы должны типизировать все те пропсы, которые будем передавать в компонент Button, а это children, width и остальные пропсы ...props. Ну здесь мы остальные пропсы ...props трогать не будем, потому что они могут добавлять, могут не добавляться. Опишем только то, что точно должно передаваться, это children и ширина width - ширина, кстати, опциональная.

Button.propTypes = {
	children: PropTypes.node.isRequired,
	width: PropTypes.string,
};
