// Это компонент Статьи (без редактирования). На странице будет кнопка редактирования (fa-pencil-square-o) и кнопка удаления fa-trash-o (она одинакова для редактируемой и не редактируемой страницы Статьи), поэтому кнопку удаления перенесли в общий файл управления special-panel.jsx.
// В общем файле special-panel.jsx для управления файлами post-content и post-form (компонент редактируемой страницы Статьи) используются эти кнопки, то есть общая кнопка удаления одинаковая и принимает как бы для одного и того же места на странице то кнопку редактирования, то кнопку сохранения, то есть одна кнопка будет менять - на странице нередактируемой статьи будет кнопка редактирования, а на странице редактирования статьи на этом же месте будет кнопка сохранения поле редактирования

// import PropTypes from 'prop-types'; // - так как мы отдельно сделали константу с типизацией, то здесь не понадобился этот импорт
import { useNavigate } from 'react-router-dom';
import { H2, Icon } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import styled from 'styled-components';
import { PROP_TYPE } from '../../../../constants';

const PostContentContainer = ({
	className,
	post: { id, title, imageUrl, content, publishedAt },
}) => {
	// получил navigate  с помощью хука useNavigate
	const navigate = useNavigate();

	return (
		<div className={className}>
			{/* сначала идет картинка */}
			{/* здесь у меня была ошибка и мне пришлось изменить строку кода, чтобы ошибка исчезла. Когда данные о статье еще не загружены, переменная imageUrl равна пустой строке ''. React пытается отобразить <img src="">, что вызывает предупреждение. Рендерим картинку только если есть ссылка */}
			{imageUrl ? <img src={imageUrl} alt={title} /> : null}
			{/* теперь идет заголовок статьи */}
			<H2>{title}</H2>
			{/* теперь идет блок с датой и кнопочками */}
			{/* ниже идет разметка, которая повторяется в двух компнентах, поэтому вырежем её и перенесем с новый файл special-panel.jsx, то есть делаем рефакторинг, а вместо него вставим теперь готовый компонент SpecialPanel с этим же кодом */}
			<SpecialPanel
				id={id}
				publishedAt={publishedAt}
				margin="-20px 0 20px"
				editButton={
					<Icon
						id="fa-pencil-square-o"
						size="21px"
						margin="0 10px 0 0"
						onClick={() => navigate(`/post/${id}/edit`)}
					/>
				}
			/>
			{/* <div className="special-panel">
				<div className="published-at">
					<Icon
						id="fa-calendar-o"
						margin="0 7px 0 0"
						size="18px"
						onClick={() => {}}
					/>
					{publishedAt}
				</div> */}
			{/* панель с кнопками в статье */}
			{/* <div className="buttons">
					<Icon
						id="fa-pencil-square-o"
						size="21px"
						margin="0 10px 0 0"
						onClick={() => {}}
					/>
					<Icon id="fa-trash-o" size="21px" onClick={() => {}} />
				</div>
			</div> */}
			{/* а теперь идет размещается контент (текст статьи) на странице Статья */}
			<div className="post-text">{content}</div>
		</div>
	);
};

export const PostContent = styled(PostContentContainer)`
	& img {
		float: left;
		margin: 0 20px 10px 0;
	}

	& .post-text {
		font-size: 18px;
		white-space: pre-line;
	}
`;

PostContent.propTypes = {
	post: PROP_TYPE.POST.isRequired,
};
