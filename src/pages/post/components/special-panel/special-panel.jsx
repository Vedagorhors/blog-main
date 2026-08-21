import { Icon } from '../../../../components';
import styled from 'styled-components';

// индексировать (делать реэкспорт) не будем, потому что этот компонент не предназначен для использования извне этой папки components. Это компонент для того, чтобы его использовали его соседи, а они его будут использовать через прямой импорт, а не через индексированный для того, чтобы не появилась проблема с циклическими зависимостями
const SpecialPanelContainer = ({ className, publishedAt, editButton }) => {
	return (
		<div className={className}>
			<div className="published-at">
				<Icon
					id="fa-calendar-o"
					margin="0 7px 0 0"
					size="18px"
					onClick={() => {}}
				/>
				{publishedAt}
			</div>
			{/* панель с кнопками в статье. Кнопка удаления будет одинаковой, а кнопка сохранения fa-floppy-o будет меняться, её нужно будет указывать, поэтому сделаем её через пропсы */}
			<div className="buttons">
				{/* Теперь Icon мы обработали и сюда вставляем просто editButton. В файле post-content эта иконда будет fa-pencil-square-o, то есть кнопка для редактирования с карандашом, а в файле post-form эта иконка будет как fa-floppy-o, то есть кнопка для сохранения отредактируемой статьи */}
				{editButton}
				{/* <Icon
					id="fa-floppy-o"
					size="21px"
					margin="0 10px 0 0"
					onClick={() => {}}
				/> */}
				<Icon id="fa-trash-o" size="21px" onClick={() => {}} />
			</div>
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
