import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../../../components';
import styled from 'styled-components';

// Так как нам потребуется выравнивать кнопки панели управления по правому краю, то создадим компонент для стилизации

const RightAligned = styled.div`
	display: flex;
	justify-content: flex-end;
`;

// здесь const Button = styled.Button тоже меняем styled.button на styled(Link), так как нам теперь нужно стилизовать не кнопку а уже ссылку Link. Вызовем styled и отправим в него Link
const StyledLink = styled(Link)`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	width: 100px;
	height: 32px;
	border: 1px solid #000;
	background-color: #eee;
`;

const StyledButton = styled.div`
	&:hover {
		cursor: pointer;
	}
`;

const ControlPanelContainer = ({ className }) => {
	const navigate = useNavigate();
	return (
		<div className={className}>
			<RightAligned>
				{/* Вместо названия Button мы написали потом Link для роутинга */}
				<StyledLink to="/login">Войти</StyledLink>
			</RightAligned>
			<RightAligned>
				<StyledButton onClick={() => navigate(-1)}>
					<Icon id="fa-backward" margin="10px 0 0 0" />
				</StyledButton>
				<Link to="/post">
					<Icon id="fa-file-text-o" margin="10px 0 0 5px" />
				</Link>
				<Link to="/users">
					<Icon id="fa-users" margin="10px 0 0 5px" />
				</Link>
			</RightAligned>
		</div>
	);
};

export const ControlPanel = styled(ControlPanelContainer)``;
