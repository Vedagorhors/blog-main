import { Link } from 'react-router-dom';
import { Icon } from '../../../../components';
import styled from 'styled-components';

// const IconContainer = ({ className }) => (
// 	<div className={className}>
// 		<i className="fa fa-code" aria-hidden="true"></i>
// 	</div>
// );

// Чтобы задать размер для иконки необходимо создать стилизованный компонент. Мы создали его в отдельном файле icon.jsx и туда (см ниже) передаем пропсы размеров size и margin и id="fa-code"
// const Icon = styled(IconContainer)`
// 	font-size: 70px;
// 	margin-right: 10px;
// `;

const LargeText = styled.div`
	font-size: 48px;
	font-weight: 600;
	line-height: 48px;
	margin-top: 17px;
`;

const SmallText = styled.div`
	font-size: 18px;
	font-weight: bold;
`;

const LogoContainer = ({ className }) => (
	// сделаем обертку для логотипа ввиде тега div
	<Link className={className} to="/">
		<Icon id="fa-code" size="70px" margin="0 10px 0 0" />
		<div>
			<LargeText>Блог</LargeText>
			<SmallText>веб-разработчика</SmallText>
		</div>
	</Link>
);

export const Logo = styled(LogoContainer)`
	display: flex;
	margin-top: -21px;
`;
