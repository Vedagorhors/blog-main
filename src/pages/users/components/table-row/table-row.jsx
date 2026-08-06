import styled from 'styled-components';

const TableRowContainer = ({ className, children }) => (
	// выводим children, обернутый в div
	<div className={className}>{children}</div>
);

export const TableRow = styled(TableRowContainer)`
	display: flex;
	align-items: center;
	border: ${({ border }) => (border ? '1px solid #000' : 'none')};
	// можно еще эаписать это так:
	// ${({ border }) => (border ? 'border: 1px solid #000' : '')};
	// обращаемся к классу напрямую внутри строкового шаблона, то он не хэширует уже, то есть он хэш накидывает на то, что мы оборачиваем функцией styled (styled(TableRowContainer)). Этот класс, к которомумы обращаемся, лежит в другом компоненте в файле users.jsx
	// здесь div это все три класса login-column, registered-column, role-column, потому что они обернуты в этот div в файле user-row.jsx
	& > div {
		display: flex;
		padding: 0 10px;
	}

	& .login-column {
		width: 172px;
	}

	& .registered-column {
		width: 213px;
	}

	& .role-column {
		width: auto;
	}
`;
