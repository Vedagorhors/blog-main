import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CLOSE_MODAL, openModal, removePostAsync } from '../../../../actions';
import { Icon } from '../../../../components';
import { useServerRequest } from '../../../../hooks';
import { checkAccess } from '../../../../utils';
import { selectUserRole } from '../../../../selectors';
import { ROLE } from '../../../../constants';
import styled from 'styled-components';

// индексировать (делать реэкспорт) не будем, потому что этот компонент не предназначен для использования извне этой папки components. Это компонент для того, чтобы его использовали его соседи, а они его будут использовать через прямой импорт, а не через индексированный для того, чтобы не появилась проблема с циклическими зависимостями
const SpecialPanelContainer = ({ className, id, publishedAt, editButton }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const requestServer = useServerRequest();
	const userRole = useSelector(selectUserRole);
	// Удаление статьи с помощью экшена (action) removePostAsync
	const onPostRemove = (id) => {
		// мы здесь должны открыть модальное окно. Ниже применим экшены, которые после этого создадим в отдельных файлах
		// для открытия модального окна создадим action-creator  и в него передадим информацию, что в нем должно отображаться
		dispatch(
			openModal({
				text: 'Удалить статью?',
				// пока не понятно, что делать на подтверждение Confirm, поэтому ставлю заглушку
				// onConfirm: '',
				// мы отправляем коллбэк, который будет выполнять удаление комментария, который мы уже реализовали и опробовали
				onConfirm: () => {
					// нам нужно сделать редирект (переадресацию) на главную страницу после удаления статьи. Здесь нужно понимать, что строка dispatch(CLOSE_MODAL) синхронный код и он сработает раньше, чем код dispatch(removePostAsync(requestServer, id)).then... потому что then это асинхронный код. После выполнения этих двух строк через некоторое время после ответа сервера выполнится уже then
					dispatch(removePostAsync(requestServer, id)).then(() => {
						// после удаления статьи переходим на главную страницу
						navigate('/');
					});
					// закрываем модальное окно сразу после того, как была нажата кнопка подтверждения удаления, то есть кнопка Да.
					dispatch(CLOSE_MODAL);
				},
				// а в onCancel мы просто закрываем модальное окно. Это будет не экшен-криэйтор, а обычный экшен константой
				onCancel: () => dispatch(CLOSE_MODAL),
				// теперь создадим эти экшены
			}),
		);
		// этот коллбык переносим выше в onConfirm.
		// dispatch(removePostAsync(requestServer, postId, id));
	};
	// Создадим этот экшен removePostAsync. Создадим новый файл remove-post-async.js а также нужно реализовать операцию и обращение к базе данных

	// Чтобы мы на странице статьи могли скрывать или отображать кнопки, необходимо сначала проверить доступ пользователя в зависимости от его роли. isAdmin - проверка, что пользователь является админом. Используем утилиту checkAccess и передаем в неё роль ADMIN и текущую роль пользователя roleId
	// roleId заменяем на userRole (это одно и тоже)
	const isAdmin = checkAccess([ROLE.ADMIN], userRole);

	return (
		<div className={className}>
			<div className="published-at">
				{/* Чтобы иконка календаря не отображалась на странице создания статьи, так как статья еще не опубликована, то сделаем так - иконку показываем тольк, если в publishedAt что-то имеется. Получается если есть дата публикации, значит статья существует */}
				{publishedAt && (
					<Icon
						inactive={true}
						id="fa-calendar-o"
						margin="0 7px 0 0"
						size="18px"
					/>
				)}
				{publishedAt}
			</div>
			{/* панель с кнопками в статье. Кнопка удаления будет одинаковой, а кнопка сохранения fa-floppy-o будет меняться, её нужно будет указывать, поэтому сделаем её через пропсы */}
			{isAdmin && (
				<div className="buttons">
					{/* Теперь Icon мы обработали и сюда вставляем просто editButton. В файле post-content эта иконда будет fa-pencil-square-o, то есть кнопка для редактирования с карандашом, а в файле post-form эта иконка будет как fa-floppy-o, то есть кнопка для сохранения отредактируемой статьи */}
					{editButton}
					{/* <Icon
					id="fa-floppy-o"
					size="21px"
					margin="0 10px 0 0"
					onClick={() => {}}
				/> */}
					{/* Чтобы иконка корзины не отображалась на странице создания статьи, так как статья еще не опубликована и удалять нечего, то сделаем так - иконку показываем только, если в publishedAt что-то имеется. Получается если есть дата публикации, значит статья существует и её можно удалить */}
					{publishedAt && (
						<Icon
							id="fa-trash-o"
							size="21px"
							margin="0 0 0 7px"
							onClick={() => onPostRemove(id)}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export const SpecialPanel = styled(SpecialPanelContainer)`
	display: flex;
	justify-content: space-between;
	margin: ${({ margin }) => margin};

	& .published-at {
		display: flex;
		font-size: 18px;
	}

	& .buttons {
		display: flex;
	}
	& i {
		position: relative;
		top: -1px;
	}
`;

SpecialPanel.propTypes = {
	id: PropTypes.string.isRequired,
	publishedAt: PropTypes.string.isRequired,
	editButton: PropTypes.node.isRequired,
};
