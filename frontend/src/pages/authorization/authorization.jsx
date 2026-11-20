import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// import { server } from '../../bff';
import { AuthFormError, Button, H2, Input } from '../../components';
import { useResetForm } from '../../hooks';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constants';
import styled from 'styled-components';
import { request } from '../../utils/request';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры')
		.min(3, 'Неверно заполнен пароль. Минимум 3 символа')
		.max(15, 'Неверно заполнен пароль. Максимум 15 символов'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверно заполнен пароль. Допускаются буквы, цифры и знаки # %',
		)
		.min(6, 'Неверно заполнен пароль. Минимум 6 символов')
		.max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
});

const StyledLink = styled(Link)`
	text-align: center;
	text-decoration: underline;
	margin: 20px 0;
	font-size: 18px;
`;

const AuthorizationContainer = ({ className }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const [serverError, setServerError] = useState(null);

	const dispatch = useDispatch();

	const roleId = useSelector(selectUserRole);

	useResetForm(reset);

	const onSubmit = ({ login, password }) => {
		setServerError(null);
		return request('/login', 'POST', { login, password })
			.then(({ error, user }) => {
				// Настоящий backend возвращает пользователя в user, а не в res.
				if (error) {
					setServerError(`Ошибка запроса: ${error}`);
					return;
				}
				// Не сохраняем undefined или неполный ответ как вошедшего пользователя.
				if (
					!user?.id ||
					typeof user.login !== 'string' ||
					!user.login ||
					![ROLE.ADMIN, ROLE.MODERATOR, ROLE.READER].includes(user.roleId)
				) {
					throw new Error('Сервер вернул некорректные данные пользователя');
				}
				sessionStorage.setItem('userData', JSON.stringify(user));
				dispatch(setUser(user));
			})
			.catch((error) => {
				setServerError(`Ошибка запроса: ${error.message}`);
			});
	};

	const formError = errors?.login?.message || errors?.password?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			{}
			<H2>Авторизация</H2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Логин..."
					autoComplete="username"
					{...register('login', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="password"
					placeholder="Пароль..."
					autoComplete="current-password"
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>
				{}
				<Button type="submit" disabled={!!formError}>
					Авторизоваться
				</Button>
				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
				<StyledLink to="/register">Регистрация</StyledLink>
			</form>
		</div>
	);
};

export const Authorization = styled(AuthorizationContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > form {
		display: flex;
		flex-direction: column;
		width: 260px;
	}
`;
