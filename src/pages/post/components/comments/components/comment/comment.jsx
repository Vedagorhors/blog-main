import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '../../../../../../components';
import { useServerRequest } from '../../../../../../hooks';
import { openModal, CLOSE_MODAL, removeCommentAsync } from '../../../../../../actions';
import { selectUserRole } from '../../../../../../selectors';
import { ROLE } from '../../../../../../constants';
import styled from 'styled-components';

const CommentContainer = ({ className, postId, id, author, publishedAt, content }) => {
	// диспатч нужно получить из хука
	const dispatch = useDispatch();
	// нужно добавить requestServer c помощью хука
	const requestServer = useServerRequest();
	const userRole = useSelector(selectUserRole);

	// Удаление комментария с помощью экшена (action) removeCommentAsync
	const onCommentRemove = (id) => {
		// мы здесь должны открыть модальное окно. Ниже применим экшены, которые после этого создадим в отдельных файлах
		// для открытия модального окна создадим action-creator  и в него передадим информацию, что в нем должно отображаться
		dispatch(
			openModal({
				text: 'Удалить комментарий?',
				// пока не понятно, что делать на подтверждение Confirm, поэтому ставлю заглушку
				// onConfirm: '',
				// мы отправляем коллбэк, который будет выполнять удаление комментария, который мы уже реализовали и опробовали
				onConfirm: () => {
					dispatch(removeCommentAsync(requestServer, postId, id));
					// закрываем модальное окно сразу осле того, как была нажата кнопка подтверждения удаления, то есть кнопка Да.
					dispatch(CLOSE_MODAL);
				},
				// а в onCancel мы просто закрываем модальное окно. Это будет не экшен-криэйтор, а обычный экшен константой
				onCancel: () => dispatch(CLOSE_MODAL),
				// теперь создадим эти экшены
			}),
		);
		// этот коллбык перносим выше в onConfirm.
		// dispatch(removeCommentAsync(requestServer, postId, id));
	};
	// console.log(author);

	// Создадим этот экшен. Создадим новый файл remove-comment-async.js

	// Чтобы скрывать кнопку удаления в зависимости от роли, введем проверку Админ или модератор. Проверяем includes для userRole. userRole в данном файле нет, поэтому нужно её получить с помощью useSelector (см. выше)
	const isAdminOrModerator = [ROLE.ADMIN, ROLE.MODERATOR].includes(userRole);

	return (
		<div className={className}>
			<div className="comment">
				<div className="information-panel">
					<div className="author">
						<Icon
							inactive={true}
							id="fa-user-circle-o"
							size="18px"
							margin="0 10px 0 0"
							onClick={() => {}}
						/>
						{author}
					</div>
					<div className="published-at">
						<Icon
							inactive={true}
							id="fa-calendar-o"
							size="18px"
							margin="0 10px 0 0"
							onClick={() => {}}
						/>
						{publishedAt}
					</div>
				</div>
				<div className="comment-text">{content}</div>
			</div>
			{/* здесь проверяем теперь - если юзер админ или модератор, то показываем кнопку удаления комментария, а для других не показываем */}
			{isAdminOrModerator && (
				<Icon
					id="fa-trash-o"
					size="21px"
					margin="0 0 0 10px"
					// по нажатию на удаление комментария мы теперь должны отправлять экшен, который откроет модальное окно и в этом окне мы передадим текст: Удалить комментарий? А для этого нужно создать еще несколько экшенов. Далее смотри выше в onCommentRemove
					onClick={() => onCommentRemove(id)}
				/>
			)}
		</div>
	);
};

export const Comment = styled(CommentContainer)`
	display: flex;
	margin-top: 10px;
	margin-top: 10px;

	& .comment {
		width: 550px;
		padding: 5px 10px;
		border: 1px solid #000;
	}

	& .information-panel {
		display: flex;
		justify-content: space-between;
	}
	& .author {
		display: flex;
	}
	& .published-at {
		display: flex;
	}
`;
