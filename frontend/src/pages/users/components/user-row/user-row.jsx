import PropTypes from 'prop-types';
import { Icon } from '../../../../components';
import { useState } from 'react';
import { TableRow } from '../table-row/table-row';
// import { useServerRequest } from '../../../../hooks';
import styled from 'styled-components';
import { PROP_TYPE } from '../../../../constants';
import { request } from '../../../../utils/request';

const UserRowContainer = ({
	className,
	id,
	login,
	registeredAt,
	roleId: userRoleId,
	roles,
	onUserRemove,
}) => {
	const [saveError, setSaveError] = useState(null);
	const [initialRoleId, setInitialRoleId] = useState(userRoleId);
	const [selectedRoleId, setSelectedRolId] = useState(userRoleId);
	// const requestServer = useServerRequest();

	const onRoleChange = ({ target }) => {
		setSelectedRolId(Number(target.value));
	};

	// Интеграция фронтенда с бэкендом. Убираем requestServer

	const onRoleSave = (userId, newUserRoleId) => {
		// request('updateUserRole', userId, newUserRoleId).then(() => {
		setSaveError(null);
		request(`/users/${userId}`, 'PATCH', { roleId: newUserRoleId })
			.then(({ data }) => {
				if (!data?.id) throw new Error('Сервер не вернул пользователя');
				setInitialRoleId(data.roleId);
			})
			.catch((error) => setSaveError(error.message));
	};

	const isSaveButtonDisabled = selectedRoleId === initialRoleId;

	return (
		<div className={className}>
			{}
			{saveError && <div role="alert">Ошибка сохранения роли: {saveError}</div>}
			<TableRow border={true}>
				{}
				<div className="login-column">{login}</div>
				<div className="registered-column">{registeredAt}</div>
				{}
				<div className="role-column">
					{}
					<select value={selectedRoleId} onChange={onRoleChange}>
						{roles.map(({ id: roleId, name: roleName }) => (
							<option key={roleId} value={roleId}>
								{roleName}
							</option>
						))}
					</select>
					<Icon
						id="fa-floppy-o"
						margin="0 0 0 10px"
						disabled={isSaveButtonDisabled}
						onClick={() => onRoleSave(id, selectedRoleId)}
					/>
				</div>
			</TableRow>
			<Icon id="fa-trash-o" margin="0 0 0 10px" onClick={onUserRemove} />
		</div>
	);
};

export const UserRow = styled(UserRowContainer)`
	display: flex;
	margin-top: 10px;

	& select {
		padding: 0 5px;
		font-size: 16px;
	}
`;

UserRow.propTypes = {
	id: PropTypes.string.isRequired,
	login: PropTypes.string.isRequired,
	registeredAt: PropTypes.string.isRequired,
	roleId: PROP_TYPE.ROLE_ID.isRequired,
	roles: PropTypes.arrayOf(PROP_TYPE.ROLE).isRequired,
	onUserRemove: PropTypes.func.isRequired,
};
