import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from '../../../../components';
import { ROLE } from '../../../../constants';
import {
	selectUserRole,
	selectUserLogin,
	selectUserSession,
} from '../../../../selectors';
import { logout } from '../../../../actions';
import { checkAccess } from '../../../../utils';
import styled from 'styled-components';

// Так как нам потребуется выравнивать кнопки панели управления по правому краю, то создадим компонент для стилизации

const RightAligned = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	// пришлось отступить от урока, так как у меня нижние три иконки под кнопкой Войти прыгали и мне пришлось здесь зафиксировать минимальную высоту равной кнопке 32px
	min-height: 32px;
`;

// здесь const Button = styled.Button тоже меняем styled.button на styled(Link), так как нам теперь нужно стилизовать не кнопку а уже ссылку Link. Вызовем styled и отправим в него
// Теперь убираем стилизацию кнопки, так как мы сделали для этого отдельный файл button.jsx
// const StyledLink = styled(Link)`
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	font-size: 18px;
// 	width: 100px;
// 	height: 32px;
// 	border: 1px solid #000;
// 	background-color: #eee;
// `;

// эту обёртку перенесли внутрь иконки в файл icon.jsx
// const StyledIcon = styled.div`
// 	&:hover {
// 		cursor: pointer;
// 	}
// `;

const UserName = styled.div`
	font-size: 18px;
	font-weight: bold;
`;

const ControlPanelContainer = ({ className }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);
	const login = useSelector(selectUserLogin);
	// сессию также берем из стейта с помощью селектора
	const session = useSelector(selectUserSession);

	// делаем функцию для очистки sessionStorage после нажатия на кнопку разлогиниться, то на на стрелку выхода (иконка a-sign-out)
	const onLogout = () => {
		dispatch(logout(session));
		sessionStorage.removeItem('userData');
	};

	// Чтобы мы на главной странице могли скрывать или отображать кнопки, необходимо сначала проверить доступ пользователя в зависимости от его роли. isAdmin - проверка, что пользователь является админом. Используем утилиту checkAccess и передаем в неё роль ADMIN и текущую роль пользователя roleId
	const isAdmin = checkAccess([ROLE.ADMIN], roleId);

	return (
		<div className={className}>
			<RightAligned>
				{/* Если роль у пользователя равна Гость, то мы отображаем кнопку Войти, если не гость, а другая роль, то нужно отобразить какие-то данные для авторизованного пользователя, а конкретно это логин и кнопка Выйти */}
				{roleId === ROLE.GUEST ? (
					<Button>
						<Link to="/login">Войти</Link>
					</Button>
				) : (
					<>
						{/* в шапке размещаем имя пользователя, иконку выхода то есть кнопка, чтобы разлогиниться, по нажатию на которую будет отправляться экшен, чтобы разлогинить пользователя  */}
						<UserName>{login}</UserName>
						{/* эта оберта уже не нужна, так как мы перенесли стилизацию в файл icon.jsx */}
						{/* <StyledIcon> */}
						<Icon
							id="fa-sign-out"
							margin="0 0 0 10px"
							// здесь по нажатию запускаем loguot. В файле app-reducer этот logout отловиться, измениться флаг, а уже изменения флага мы отловим в файле authorization.jsx в subscribe.  Сложная схема, но зато она позволяет передавать данные и реагировать на какие-то изменения просто совершенно разным местам приложения, так как шапка и страница это разные места, два разных компонента, а мы взяли и передали между ними данные
							// мы сначала делали эту заглушку:
							// onClick={() => dispatch(logout(session))}
							// // а потом написали функцию onLogout и просто вставили вместо заглушки, вот так:
							onClick={onLogout}
						/>
						{/* </StyledIcon> */}
					</>
				)}
			</RightAligned>
			<RightAligned>
				{/* <StyledIcon> */}
				<Icon id="fa-backward" margin="10px 0 0 0" onClick={() => navigate(-1)} />
				{/* </StyledIcon> */}
				{isAdmin && (
					<>
						<Link to="/post">
							<Icon id="fa-file-text-o" margin="10px 0 0 16px" />
						</Link>
						<Link to="/users">
							<Icon id="fa-users" margin="10px 0 0 16px" />
						</Link>
					</>
				)}
			</RightAligned>
		</div>
	);
};

export const ControlPanel = styled(ControlPanelContainer)``;
