// Компонент модульного окна
import { useSelector } from 'react-redux';
import { Button } from '../button/button';
import {
	selectModalIsOpen,
	selectModalOnCancel,
	selectModalOnConfirm,
	selectModalText,
} from '../../selectors';
import styled from 'styled-components';

// ModalContainer будет возвращать разметку модального окна. Сначала будет подкладка, то есть фон overlay. Затем созадим коробку с информацией box в которой будет заголовок h3 с вопросом {text} Дальше идет блок кнопок buttons
// здесь пропсов не будет, так как модальное окно будет в самом корне приложения, а вызывать мы его будем из глубины, поэтому пропсы здесь не подходят
const ModalContainer = ({ className }) => {
	// сделаем так, чтобы окно открывалось и закрывалось. Селекторы должны доставать данные из стейта
	const isOpen = useSelector(selectModalIsOpen);
	const text = useSelector(selectModalText);
	const onConfirm = useSelector(selectModalOnConfirm);
	const onCancel = useSelector(selectModalOnCancel);

	// Сделаем условный рендеринг. Если модальное окно закрыто, то мы ничего не отображаем. Ну а если окно открыто, то отображаем разметку. Настроим управление - открытие и закрытие окна, соответственно отправляя экшены в redux store
	if (!isOpen) {
		return null;
	}

	return (
		<div className={className}>
			<div className="overlay"></div>
			<div className="box">
				{/* текст будем брать из redux store. Отправляем мы его из комментария, файл comment.js */}
				<h3>{text}</h3>
				<div className="buttons">
					<Button width="120px" onClick={onConfirm}>
						Да
					</Button>
					<Button width="120px" onClick={onCancel}>
						Отмена
					</Button>
				</div>
			</div>
		</div>
	);
};

export const Modal = styled(ModalContainer)`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 20;

	& .overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
	}

	& .box {
		position: relative;
		top: 50%;
		transform: translate(0, -50%);
		width: 400px;
		margin: 0 auto;
		padding: 0 20px 20px;
		text-align: center;
		background-color: #fff;
		border: 3px solid #000;
		z-index: 30;
	}

	& .buttons {
		display: flex;
		justify-content: center;
	}

	& .buttons button {
		margin: 0 5px;
	}
`;

// модальное окно также используем в корневом компоненте в blog.jsx
