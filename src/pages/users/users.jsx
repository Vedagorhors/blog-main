import { useEffect, useState } from 'react';
import { Content, H2 } from '../../components';
import { TableRow, UserRow } from './components';
import { useServerRequest } from '../../hooks';
import { ROLE } from '../../constants';
import styled from 'styled-components';

// добавляем className в UsersContainer, чтобы мог работать styled-components
const UsersContainer = ({ className }) => {
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	// создадим флаг, по которому будет обновляться список пользователей. Добавим shouldUpdateUserList в useEffect в массив зависимостей
	const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false);
	// console.log('shouldUpdateUserList', shouldUpdateUserList);

	// На сервере у нас есть как-бы ручки и вот мы их запрашиваем, описывая здесь адрес этих ручек и один из адресов, это fetchRoles. При необходимости можем передавать нагрузочные данные вторым аргументом
	const requestServer = useServerRequest();
	// мы должны запросить и получить роли с сервера
	// const users = []; - эта заглушка уходит

	// делаем запросы на сервер в хуке useEffect
	useEffect(() => {
		// console.log('useEffect');

		Promise.all([requestServer('fetchUsers'), requestServer('fetchRoles')]).then(
			([usersRes, rolesRes]) => {
				if (usersRes.error || rolesRes.error) {
					setErrorMessage(usersRes.error || rolesRes.error);
					// останавливаем выполнение функции
					return;
				}
				// console.log(usersRes, rolesRes);

				// если ошибки нет, то мы устанавиливаем пользователей из usersRes и устанавливаем роли. Страницу мы покажем только в том случае, если у нас все эти данные загрузились
				setUsers(usersRes.res);
				setRoles(rolesRes.res);
			},
		);
		// здесь возникло замечания приттера, что в пустой массив зависимостей хука useEffect необходимо вставить requestServer, но если мы вставим, то при каждом рендере у нас будет запускаться useEffect, а нам нужно, чтобы наша функция имела постоянную ссылку, если сессия session не меняется. Для этого нужно в файле use-server-request.js применить useCallback. Далее пояснения смотри в файле use-server-request.js
	}, [requestServer, shouldUpdateUserList]);

	// Реализуем удаление пользователя. После удаления необходимо обновить список пользователей
	const onUserRemove = (userId) => {
		console.log('onUserRemove', userId);
		requestServer('removeUser', userId).then(() => {
			// console.log('requestServer then');
			// после того, как мы получили ответ от удаления пользователя делаем так:
			setShouldUpdateUserList(!shouldUpdateUserList);
		});
		// затем берем это коллбэк и щлем его в UserRow, см. ниже
	};

	return (
		<div className={className}>
			{/* оборачиваем всё в компонент Content и передаем проп error, чтобы компонент Content сам определил есть ошибка или нет */}
			<Content error={errorMessage}>
				<H2>Пользователи</H2>
				<div>
					{/* TableRow - это в разметке строка с надписями Логин Дата регистрации и Роль */}
					<TableRow>
						<div className="login-column">Логин</div>
						<div className="registered-column">Дата регистрации</div>
						<div className="role-column">Роль</div>
					</TableRow>
					{/* так как у нас на странице пользователи будут строки в таблице, то, чтобы их выводить, нам нужно пройтись по массиву. В React массив нужно обязательно рендерить с помощью ключа key. Так как у нас пересекается id, то есть id есть в массиве users и в массиве roles, то мы в массиве эзеров получим id под другим именем, вот так: id: userId (при диструктуризации можно менять имя переменной). С roleId поступим также roleId: userRoleId.
					Но потом я вернул имена назад, так как создал отделые файлы с компонентом UserRow и имена перестали пересекаться.
					Получается, что компонент Users выводит нам список компонентов UserRow и этот список может только обновляться */}
					{users.map(({ id, login, registeredAt, roleId }) => (
						<UserRow
							key={id}
							id={id}
							login={login}
							registeredAt={registeredAt}
							roleId={roleId}
							// отфильтруем так, чтобы id роли было не равно Гость
							roles={roles.filter(
								({ id: roleId }) => roleId !== ROLE.GUEST,
							)}
							// когда мы проходимся по массиву, то у нас уже имеется id и мы можем для каждого элемента массива сразу задать нужный обработчик и получится, что внутри компонента нужно будет дернуть этот обработчик и даже ничего не передавать в него.
							onUserRemove={() => onUserRemove(id)}
						/>
					))}
				</div>
			</Content>
		</div>
	);
};

export const Users = styled(UsersContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	wight: 570px;
	font-size: 18px;
`;
// можно создать стилизованный компонент и для него отдельно стили написать, но зачем, если можно для стилей компонента просто обратиться по классу и написать всё, что нам нужно, то есть делаем просто вложенный стиль с помощью спец. символа &. Но мы создали отдельный компонент TableRow  и туда пернесли стили, котоорые были описаны ниже
// & .table-header {}
