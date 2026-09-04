import PropTypes from 'prop-types';
import styled from 'styled-components';

// принимаем children, то есть содержимое (в данном случае содержимое это слово Авторизация) и еще принимаем className, чтобы у нас styled-components работал
const H2Container = ({ children, className }) => (
	<h2 className={className}>{children}</h2>
);

export const H2 = styled(H2Container)`
	margin: 40px 0;
`;

H2.propTypes = {
	children: PropTypes.node.isRequired,
};
