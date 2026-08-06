import styled from 'styled-components';

const IconContainer = ({ className, id, ...props }) => (
	<div className={className} {...props}>
		<i className={`fa ${id}`} aria-hidden="true"></i>
	</div>
);

// Чтобы задать размер для иконки необходимо создать стилизованный компонент
export const Icon = styled(IconContainer)`
	font-size: ${({ size = '24px' }) => size};
	margin: ${({ margin = '0' }) => margin};
	// делаем иконку сохранения (дискету) приглушенного неактивного цвета, если установлен запрет показа иконки disabled (см. файл user-row.jsx). То есть если disabled, то иконка бледносерого цвета, а если нет, то черного цвета, то есть иконка активна, что значит администратор выбрал другую роль и теперь унжно её сохранить
	color: ${({ disabled }) => (disabled ? '#ccc' : '#000')};

	&:hover {
		cursor: pointer;
	}
`;
