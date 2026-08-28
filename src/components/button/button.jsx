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
