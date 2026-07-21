import styled from 'styled-components';

const IconContainer = ({ className, id }) => (
	<div className={className}>
		<i className={`fa ${id}`} aria-hidden="true"></i>
	</div>
);

// Чтобы задать размер для иконки необходимо создать стилизованный компонент
export const Icon = styled(IconContainer)`
	font-size: ${({ size = '24px' }) => size};
	margin: ${({ margin = '0' }) => margin};
	margin-right: 10px;
`;
