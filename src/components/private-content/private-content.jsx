// Создадим компонент Content ошибки с доступом и будем использовать его на каждой странице, где нам требуется управлять доступом. А для страницы авторизации и регистрации управление доступом не требуется.
// Этот компонент проверяет доступ и делает это до обращения к серверу.

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Error } from '../error/error';
import { selectUserRole } from '../../selectors';
import { checkAccess } from '../../utils';
import { ERROR, PROP_TYPE } from '../../constants';

// в компонент Error передаем ошибку error для отображения
export const PrivateContent = ({ children, access, serverError = null }) => {
	// в массиве access приходит информация о том, кто имеет право на доступ, а мы должны получить информацию о том, какая роль у текущего пользователя
	const userRole = useSelector(selectUserRole);
	// console.log('userRole', userRole);

	// вычисляем ошибку доступа. Берем массив access и проверяем его на includes. Он должен включать в себя userRole. Если включает, то ошибки нет, а если включает, то есть.
	const accessError = checkAccess(access, userRole) ? null : ERROR.ACCESS_DENIED;
	// вычислим ошибку для отображения error. Она будет складываться из ошибки сервера serverError, а если её нет, то из ошибки доступа accessError, а если все там null, то ошибки не будет
	const error = serverError || accessError;
	// console.log(serverError, accessError);

	// также к нам приходит ошибка от сервера serverError. Отдаем приоритет ошибке из сервера
	return error ? <Error error={error} /> : children;
};

// взяли типизацию из файла prop-type.js константы ROLE и ERROR
PrivateContent.propTypes = {
	children: PropTypes.node.isRequired,
	access: PropTypes.arrayOf(PROP_TYPE.ROLE_ID).isRequired,
	serverError: PROP_TYPE.ERROR,
};
