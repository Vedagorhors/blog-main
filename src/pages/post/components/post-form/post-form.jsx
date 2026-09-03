// Компонент: Форма для редактирования статьи. В эту форму будем вносить данные и отправлять их на сервер. Скопируем код с файла post-content.js
// На странице будет кнопка сохранения (fa-floppy-o) и кнопка удаления fa-trash-o (она одинакова для редактируемой и не редактируемой страницы Статьи), поэтому кнопкку удаления перенесли в общий файл управления special-panel.jsx
// В общем файле special-panel.jsx для управления файлами post-content и post-form (компонент редактируемой страницы Статьи) используются эти кнопки, то есть общая кнопка удаления одинаковая и принимает как бы для одного и того же места на странице то кнопку редактирования, то кнопку сохранения, то есть одна кнопка будет менять - на странице нередактируемой статьи будет кнопка редактирования, а на странице редактирования статьи на этом же месте будет кнопка сохранения поле редактирования
import { useRef, useState } from 'react';
import { Icon, Input } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import { savePostAsync } from '../../../../actions';
import { sanitizeContent } from './utils';
import { useServerRequest } from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PostFormContainer = ({
	className,
	post: { id, title, imageUrl, content, publishedAt },
}) => {
	// Переделаем не управляемые данные на управляемые так как возникла проблема, что при нажатии на кнопку создания новой статьи на странице создания осаются старая ссылка на картинку и старый заголовок прошлой статьи, что мы создавали. Поэтому Inputы всегда лучше делать управляемыми
	const [imageUrlValue, setImageUrlValue] = useState(imageUrl);
	const [titleValue, setTitleValue] = useState(title);
	// создадим сами рефы с помощью хука useRef. Передадим начальные значения null, до того, как в эти рефы запишутся html-элементы. Так как мы переделываем на управляемые элементы, то рефы кроме contentRef нам не нужны. Для contentRef осатется неуправляемый элемент
	// const imageRef = useRef(null);
	// const titleRef = useRef(null);
	const contentRef = useRef(null);

	// Возникла ошибка: Warning «setState in effect», поэтому пришлось удалить (закомментировать для истории) блок useLayoutEffect (строки 26–30) вместе с импортом useLayoutEffect (строка 4), а в post.jsx:52 добавить key, чтобы при смене статьи форма перемонтировалась со свежими значениями
	// useLayoutEffect(() => {
	// 	// ставим в зависимости imageUrl и title. Мы следим, чтобы они изменились и если они меняются, то мы их устанавливаем в value
	// 	setImageUrlValue(imageUrl);
	// 	setTitleValue(title);
	// }, [imageUrl, title]);

	// получаем функцию dispatch с помощью хука useDispatch
	const dispatch = useDispatch();
	// получаем функцию navigate с помощью хука useNavigate. В эту функцию можно передать дельту, то есть на сколько шагов вперед перейти по истории браузера или назад, но также мы можем передавать сюда и просто адрес
	const navigate = useNavigate();
	// Получим requestServer из нашего собственного (кастомного) хука useServerRequest
	const requestServer = useServerRequest();

	// Для использования в управляемых элементах в двух Инпутах объявим два onChange:
	const onImageChange = ({ target }) => setImageUrlValue(target.value);
	const onTitleChange = ({ target }) => setTitleValue(target.value);

	// При нажатии на кнопку сохранения (выведем данные в консоль, то есть выполним логирование, чтобы посмотреть какие данные будут отправляться на сервер) мы отправляем данные на сервер. ДЛя отправки данных созадим обработчик onSave
	const onSave = () => {
		// подготовим данные и таким образом мы получаем доступ к элементу и у этого элемента получаем значение value, в котором как раз будет новое значение. contentRef отличается, в нем вместо value  пишем innerHTML, потому что содержимое тэга div, даже если он редактируемый, это не value, а какой-то html-код
		// Так как мы переделываем на управляемые элементы, то newImageUrl и newTitle не нужны
		// const newImageUrl = imageUrlValue.current.value;
		// const newTitle = titleValue.current.value;
		// При сохранении измененного текста статьи и если я дописывал с переносами, то текст сохраняется некорректно, вставляются <br> и <div>. Поэтому нам нужно выполнить санитайзинг, то есть подчистить текст6 убрать лишнее - подготовить данные для отправки на сервер. Приняли из innerHTML и обработали
		// Это будет утилита, которая будет использоваться для компонента PostForm, поэтому не будем размещать её на корневом уровне, а разместим именно в папке post-form, то есть создадим папку utils и в ней создадим утилиту sanitize-content.js

		const newContent = sanitizeContent(contentRef.current.innerHTML);
		// Данные мы собрали и теперь их нужно отправить на сервер для сохранения с помощью асинхронного экшена. Сохраняем статью и передаем туда данные в виде объекта, после сохранения мы перемещаемся на чтение самой статьи.
		// здесь мы делаем диспатч, вызываем внутри него асинхронный экшен и диспатч обрабатываем как промис с помощью then. Сила в том, что у нас димпатч вернет Promise. А обычный синхронный экшен такой возможности не имеет. Также нужно передать requestServer, который выше получаем из нашего собственного (кастомного) хука useServerRequest
		dispatch(
			savePostAsync(requestServer, {
				id,
				// для управляемых Инпутов делаем по другому.
				// imageUrl: newImageUrl,
				// title: newTitle,
				imageUrl: imageUrlValue,
				title: titleValue,
				content: newContent,
			}),
			// Как только получили ответ от сервера, сразу делаем навигацию - делаем редирект на страницу со статьей с помощью функции navigate из react-router. В эту функцию можно передать дельту, то есть на сколько шагов вперед перейти по истории браузера или назад, но также мы можем передавать сюда и просто адрес
			// достаем id из данных, которые мы получили ({ id }), а не брать его ввиде пустой строки. Ведь от сервера придет созданная статья с правильным id, вот его мы и подставим сюда ${id}
		).then(({ id }) => navigate(`/post/${id}`));

		// Теперь, чтобы обработать данные на сервере создадим для этого операцию в отдельном файле save-post.js

		// Логирование. Выведем в консоль и посмотрим в каком виде сохраняется ссылка на картинку, заголовок и текст статьи (контент)
		// console.log(newImageUrl);
		// console.log(newTitle);
		// console.log(newContent);

		// Создадим асинхронный экшен savePostAsync в отдельном файле save-post-async.js
	};

	return (
		<div className={className}>
			{/* Для того, чтобы редактировать статью, нужно применять два input под картинку и заголовок. У нас есть компонент Input. Сделаем Input неуправляемым. Здесь просто приводится этот способ, но можно сделать Input и управляемым. Но потом мы переделали на управляемы Инпуты */}
			{/* <Input ref={imageRef} defaultValue={imageUrl} placeholder="Изображение..." />
			<Input ref={titleRef} defaultValue={title} placeholder="Заголовок..." /> */}

			{/* Inputы переделываем под управляемые элементы для картинки и заголовка: */}
			<Input
				name="imageUrl"
				value={imageUrlValue}
				placeholder="Изображение..."
				onChange={onImageChange}
			/>
			<Input
				name="title"
				value={titleValue}
				placeholder="Заголовок..."
				onChange={onTitleChange}
			/>

			{/* ниже идет разметка, которая повторяется в двух компнентах, поэтому вырежем её и перенесем с новый файл special-panel.jsx, то есть делаем рефакторинг, а вместо него вставим теперь готовый компонент SpecialPanel с этим же кодом */}
			<SpecialPanel
				id={id}
				publishedAt={publishedAt}
				margin="20px 0"
				editButton={
					<Icon
						id="fa-floppy-o"
						size="21px"
						margin="0 10px 0 0"
						// делаем обработчик пока с заглушкой, а потом уже прописали в него обработчик onSave
						// onClick={() => {}}
						onClick={onSave}
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
				</div>
				панель с кнопками в статье
				<div className="buttons">
					<Icon
						id="fa-floppy-o"
						size="21px"
						margin="0 10px 0 0"
						onClick={() => {}}
					/>
					<Icon id="fa-trash-o" size="21px" onClick={() => {}} />
				</div>
			</div> */}
			{/* а теперь размещается редактируемый текст (контент) на редактируемой странице Статья.
			Нам нужно сделать так, чтобы при редактировани конкретной статьи под объем текста статьи подстраивалась ширина и высота. В данном случае taxtarea применить не получиться, она не будет работать здесь.  В HTML есть возможность практически любой тэг сделать редактируемым, в том числе и div. Для этого применим аттрибут contentEditable. Эта возможность позволяет делать чаты, в которых будет какой-то богатый контент, не просто текстовый, а, например, со смайликами как во всех соцсетях, так вот это делают как раз с помощью  contentEditable. При применении contentEditable возникает предупреждение, что возникает слишком много возможностей для редактирования и React не может это уже контролировать - чтобы отключить это предупреждение используется аттирибут suppressContentEditableWarning */}
			<div
				ref={contentRef}
				contentEditable={true}
				suppressContentEditableWarning={true}
				className="post-text"
			>
				{content}
			</div>
			{/* <div className="post-text">{content}</div> */}
		</div>
	);
};

export const PostForm = styled(PostFormContainer)`
	& img {
		float: left;
		margin: 0 20px 10px 0;
	}

	& .post-text {
		min-height: 80px;
		border: 1px solid #000;
		font-size: 18px;
		white-space: pre-line;
	}
`;

// для того, чтобы обновить данные нам нужно их сначала собрать с наших полей. Если бы поля были управляемыми, то там было бы все просто, данные хранились бы в стейте и мы бы из стейта их брали и отправляли бы на сервер их. Но в данном случае мы решили использовать неуправляемые поля (просто для разнообразия)
// (<Input defaultValue={imageUrl} />
// <Input defaultValue={title} />) и поэтому подход будет немножко другой.
// Как же мы будем собирать данные. Мы можем обратиться к этим компонентам как к тэгам (html-элементам), поэтому нужно добавить рефы ref на эти тэги
// Как это работает. При нажатии на кнопку сохранения мы отправляем данные на сервер. ДЛя отправки данных созадим обработчик onSave
