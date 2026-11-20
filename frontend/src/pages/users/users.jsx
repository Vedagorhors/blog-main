import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PrivateContent, H2 } from '../../components';
import { TableRow, UserRow } from './components';
// import { useServerRequest } from '../../hooks';
import { selectUserRole } from '../../selectors';
import { checkAccess } from '../../utils';
import { ROLE } from '../../constants';
import styled from 'styled-components';
import { request } from '../../utils/request';

const UsersContainer = ({ className }) => {
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false);

	const userRole = useSelector(selectUserRole);

	// const requestServer = useServerRequest();

	useEffect(() => {
		if (!checkAccess([ROLE.ADMIN], userRole)) {
			return;
		}
		// Интеграция фронтенда с бэкендом. Убираем requestServer
		// Promise.all([requestServer('fetchUsers'), requestServer('fetchRoles')]).then(
		let active = true;
		Promise.all([request('/users'), request('/users/roles')])
			.then(([usersRes, rolesRes]) => {
				if (!active) return;
				setErrorMessage(null);
				// вместо res используем поле data, так как такое задано в бэкенде
				setUsers(usersRes.data);
				setRoles(rolesRes.data);
			})
			.catch((error) => { if (active) setErrorMessage(error.message); });
		return () => { active = false; };
		// }, [requestServer, shouldUpdateUserList, userRole]);
	}, [shouldUpdateUserList, userRole]);

	const onUserRemove = (userId) => {
		if (!checkAccess([ROLE.ADMIN], userRole)) {
			return;
		}

		// requestServer('removeUser', userId).then(() => {
		setErrorMessage(null);
		request(`/users/${userId}`, 'DELETE')
			.then(() => setShouldUpdateUserList((current) => !current))
			.catch((error) => setErrorMessage(error.message));
	};

	return (
		<PrivateContent access={[ROLE.ADMIN]}>
			<div className={className}>
				<H2>Пользователи</H2>
				{errorMessage && <div role="alert">{errorMessage}</div>}
				<div>
					{}
					<TableRow>
						<div className="login-column">Логин</div>
						<div className="registered-column">Дата регистрации</div>
						<div className="role-column">Роль</div>
					</TableRow>
					{}
					{users.map(({ id, login, registeredAt, roleId }) => (
						<UserRow
							key={id}
							id={id}
							login={login}
							registeredAt={registeredAt}
							roleId={roleId}
							roles={roles.filter(
								({ id: roleId }) => Number(roleId) !== ROLE.GUEST,
							)}
							onUserRemove={() => onUserRemove(id)}
						/>
					))}
				</div>
			</div>
		</PrivateContent>
	);
};

export const Users = styled(UsersContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	width: 570px;
	font-size: 18px;
`;
