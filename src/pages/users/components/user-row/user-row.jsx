// Здесь будет логика по работе с одним юзером. Мы сможем для него сохранять новую роль и удалять его
// Компонент UserRow будет запрашиваться много раз. Сколько пользователей, столько и строк позователей. Было бы не правильно вызывать запрос списка ролей для каждого пользователя отдельно. Ведь общий список он один и тот же. Поэтому будет корректнее разместить этот запрос где-то наверху и передать вниз через пропсы. Так и сделаем это в компоненте users.js

import { Icon } from '../../../../components';
// здесь мы импортируем TableRow именно из своей папки table-row, потому что какая у нас структура здесь - у нас есть папка users, в ней подпапка components и в ней два компонента файлы table-row  и user-row. Вот в компоненте Users в файле users.jsx  мы их оба используем. Получается что оба эти компонента являются дочерними для users и здесь мы можем смело их импортировать с помощью индексирования папки (с использованием index.js, где мы их реэкспортировали), вот так: import { TableRow, UserRow } from './components';
// НО здесь в user-row мы используем TableRow, но в разметке в файле здесь он является дочерним, потому что он используется здесь. А вот в структуре файлов он уже не является дочерним для UserRow, он является соседним, так как расположен по соседству на одном уровне и если мы его импортируем тоже из папки from './components' индексированной с помощью index.js, то получитися так, что импортируя фактически файлик index.js мы будем также еще и импортировать самого себя (так как в index.js реэкспортируются оба компонента TableRow и UserRow) и это может привести к циклической зависимости и приложение зависнет. Поэтому здесь мы импортируем напрямую из компонента, а не из папки индексирования и это делается для того, чтобы случчайно не импортировать самого себя.
import { useState } from 'react';
import { TableRow } from '../table-row/table-row';
import { useServerRequest } from '../../../../hooks';
import styled from 'styled-components';

const UserRowContainer = ({
	className,
	id,
	login,
	registeredAt,
	roleId: userRoleId,
	roles,
	onUserRemove,
}) => {
	// создадим состояние, впишем начальные значения. Когда компонент только монтируется, то устанавливаем ему userRoleId
	const [initialRoleId, setInitialRoleId] = useState(userRoleId);
	// для осуществления переключения селектроа select ввдем состояние
	const [selectedRoleId, setSelectedRolId] = useState(userRoleId);
	const requestServer = useServerRequest();

	// Опишем обработчик onRoleChange, чтобы работал селект, переключал роли. Преобразуем в число, когда мы выбираем в селекте что-то
	const onRoleChange = ({ target }) => {
		setSelectedRolId(Number(target.value));
	};

	// console.log(selectedRoleId, userRoleId);

	const onRoleSave = (userId, newUserRoleId) => {
		// делаем запрос на сервер
		requestServer('updateUserRole', userId, newUserRoleId).then(() => {
			// когда придет ответ от сервера, мы обновим его и установим то, которое новое newUserRoleId
			setInitialRoleId(newUserRoleId);
		});
	};

	// Создадим переменную. Если роли одинаковые, значит сохранять нечего. Имеется ввиду нажимать на иконку дискеты нет смысла
	const isSaveButtonDisabled = selectedRoleId === initialRoleId;
	// console.log(isSaveButtonDisabled);

	return (
		// в следующей строке key={id} уже не нужен, так как мы массив обрабатываем непоследственно с компонентом UserRow
		// Компонент TableRow это вот это: <div className={className}>
		<div className={className}>
			{/* здесь разрешаю использование border (окантовка), который прописан в файле table-row.jsx вот так: 	${({ border }) => (border ? 'border: 1px solid #000;' : '')} */}
			<TableRow border={true}>
				{/* здесь выводим ответ от сервера, выводим логин, дату регистрации и id роли. То есть в разметке это строка с именем юзера, цифрами даты регистрации и селектом выбора варианта роли. Так как roleId это цифра, а нам нужно получить название роли то пишем константу ROLE и по id обратиться к ней */}
				<div className="login-column">{login}</div>
				<div className="registered-column">{registeredAt}</div>
				{/* делаем div-обертку для роли, внутри этой обертки будет select и иконка для сохранения (дискета) */}
				<div className="role-column">
					{/* делаем select, чтобы можно было из выпадающего меню выбрать роль */}
					<select value={selectedRoleId} onChange={onRoleChange}>
						{roles.map(({ id: roleId, name: roleName }) => (
							<option key={roleId} value={roleId}>
								{roleName}
							</option>
						))}
					</select>
					<Icon
						// иконку Сохранить сдвинули вправо на 10px
						id="fa-floppy-o"
						margin="0 0 0 10px"
						// запрещаем показ иконки, если роли одинаковые, то есть сохранять нечего пока
						disabled={isSaveButtonDisabled}
						// Здесь мы нажимаем на кнопку дискеты для сохранения пользователя. общепринятый комменатрий TODO - означает, что нужно будет что-то там сделать в будущем, потом. И когда нужно будет найти все места обозначенные TODO, просто в поиске вводим TODO  и видим в каких файлах есть это слово, значит там нужно что-то доделать
						// onClick={() => dispatch(/* TODO */)} - уже не используем здесь
						onClick={() => onRoleSave(id, selectedRoleId)}
					/>
				</div>
			</TableRow>
			<Icon
				// иконку мусорки сдвинули от строк с данными пользователя (рамки) вправо на 10px
				id="fa-trash-o"
				margin="0 0 0 10px"
				// Здесь мы нажимаем на кнопку корзины для удаления пользователя.  общепринятый комменатрий TODO - означает, что нужно будет что-то там сделать в будущем, потом. И когда нужно будет найти все места обозначенные TODO, просто в поиске вводим TODO  и видим в каких файлах есть это слово, значит там нужно что-то доделать
				// не будем применять onClick={() => dispatch(/* TODO */)}
				onClick={onUserRemove}
			/>
		</div>
	);
};

export const UserRow = styled(UserRowContainer)`
	display: flex;
	margin-top: 10px;

	// нам нужно для select указать стиль, но у select нет класса, поэтому обратимся к самому тегу select. Вообще, если тэг дочерний, то нужно указывать так: & > select Но у нас select не дочерний, поэтому пишем просто & select
	& select {
		padding: 0 5px;
		font-size: 16px;
	}
`;
