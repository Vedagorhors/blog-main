// создадим страницу Статья
// Страница Статья доступна для всех пользователей, поэтому сообщение об ошибке показывать не нужно. То есть нам не потребуется заворачивать содержимое в тег Content, который проверяет на ошибку
import { useEffect, useLayoutEffect, useState } from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Comments, PostContent, PostForm } from './components';
import { Error, PrivateContent } from '../../components';
import { useServerRequest } from '../../hooks';
import { loadPostAsync, RESET_POST_DATA } from '../../actions';
import { selectPost } from '../../selectors';
import { ROLE } from '../../constants';
import styled from 'styled-components';

const PostContainer = ({ className }) => {
	// сюда по умолчанию передадим true и тогда мы попадем в блок ошибки <div>{error}</div> (который ниже в return), но сама ошибка не отрендериться, так как boolean не рендериться в jsx.
	// в useState задаем null, потому что изначально никакой ошибки нет
	const [error, setError] = useState(null);
	// будем использовать redux store, чтобы хранить данные о странице, так что будем принимать данные из redux store с помощью селекторов
	const dispatch = useDispatch();
	// получаем параметры
	const params = useParams();

	// установим флаг загрузки. Мы же на загрузку должны реагировать. Как только открываем страницу, у нас загрузка начинается, значит по умолчанию ставим true
	const [isLoading, setIsLoading] = useState(true);
	// ниже проверяем isLoading

	// Мы сбрасываем все поля на пустые, когда компонент только монтируется и для новой статьи нужно сделать так, чтобы не запрашивать данные с сервера, нам нечего там скачивать. Для этого создадим еще одного проверяльщика isCreating - является ли страница созданием статьи. Потом обработаеи в useEffect ниже
	const isCreating = useMatch('/post');

	// Чтобы понять, что у нас происходит редактирование и сделаем это с помощью хука useMatch. Пишем isEditing - то есть является ли это состояние редактированием или нет. И проверяем наш текущий роут, смотрим соответствует ли он такому шаблону: /post/:id/edit. Если совпадение есть, значит мы редактируем, если нет, значит мы просто читаем контент
	const isEditing = useMatch('/post/:id/edit');

	const requestServer = useServerRequest();
	// получаем пост, который загрузится асинхронно при открытии данной страницы Статья
	const post = useSelector(selectPost);
	// console.log(post);

	// Когда мы удаляем статью и комментарии к статье, то нужно удалить и данные из redux store, сделаем это с помощью useLayoutEffect - это аналог useEffect, но который выполняется синхронно. Вызовем его только на монтирование компонента ([]) и получится, что при каждом открытии страницы со статьей мы будем сбрасывать данные поста, а потом они уже в обычном useEffect будут подгружаться (см. ниже)
	useLayoutEffect(() => {
		// здесь мы диспатчим экшен сброса статьи. dispatch(RESET_POST_DATA) выполнится синхронно сразу при запуске компонента и через некоторое время выполнится useEffect (приведен ниже), который загрузит данные уже конкретного поста, если они нужны.
		dispatch(RESET_POST_DATA);
		// console.log('dispatch');
		// useLayoutEffect нужно запускать когда isCreating меняется и тогда
	}, [dispatch, isCreating]);
	// console.log('useSelector');

	// в файл reset-post-data.js добавим экшен и также обработаем его в редюсере в файле post-reducer.js

	// в useEffect получим данные с сервера о названии статьи, чтобы отобразить в заголовке H2 и вообще данные для статьи
	useEffect(() => {
		// если это создание новой статьи, то прерываем и дальше ничего не делаем, то есть не запрашиваем данные с сервера
		if (isCreating) {
			// если isCreating=true, то загрузки нет и нужно установить setIsLoading в false
			// Предупреждение редактора — setState синхронно в эффекте
			// setIsLoading(false) вызывается прямо в теле эффекта. Это не крах, а антипаттерн (каскад лишних перерисовок). Правильное решение от React-документации («You Might Not Need an Effect»): значение isCreating известно сразу (это useMatch), поэтому его надо не «синхронизировать в эффекте», а вычислять при рендере.
			// setIsLoading(false);
			return;
		}
		// задиспатчим асинхронный экшен loadPost, а какого поста мы узнаем из id, котоорый мы возьмем из адреса с помощью пакета React Router, хука useParams. Мы добавили requestServer и чтобы его использовать добавим его передать в экшен этот requestServer. Этот диспатч загружает нам данные асинхронно, а когда ответ приходит, то в файле load-post-async мы вызываем диспатч уже с синхронным экшеном dispatch(setPostData(postData)); Этот экшен в свою очередь устанавливает state в redux store и мы оттуда сможем уже их получить с помощью селектора. Для этого добавим селектор в папку selectors файл select-post.js
		// здесь обработаем, сюда приходит postData и мы проверяем есть ли ошибка в postData и если она есть, то мы её установим в состояние setError  и туда положим postData.error.
		dispatch(loadPostAsync(requestServer, params.id)).then((postData) => {
			// просто устанавливаем эти данные. Если придет null, мы его и установим
			setError(postData.error);
			// а если загрузка пошла, то только когда установили ошибку, то есть обработали ответ
			setIsLoading(false);
		});
		// подготовим асинхронный экшен loadPost, для этого в папке action создадим файл load-post.js
	}, [dispatch, requestServer, params.id, isCreating]);
	// console.log(post);

	if (isLoading && !isCreating) {
		// когда идет загрузка, то возвращаем null, то есть ничего не отображаем - пустая страница пока идет загрузка. А завершаем загрузку, когда dispatch(loadPostAsync... отрабатывает.
		return null;
	}
	// создадим пост без ошибки - специфическая страница статьи SpecificPostPage
	const SpecificPostPage =
		isCreating || isEditing ? (
			<PrivateContent access={[ROLE.ADMIN]}>
				<div className={className}>
					<PostForm key={post.id} post={post} />
				</div>
			</PrivateContent>
		) : (
			<div className={className}>
				{/* если идет создание статьи, то отправляем исходные данные, а если не
					создание, то отправляем статью  - этот костыль уже не нужен */}
				{/* <PostContent post={isCreating ? initialPostState : post} /> */}
				{/* для этой части доступ не ограниченный */}
				{/* отправим полученные с помощью селектора данные внутрь компонета post и в комментарии в компонент Comments также отрпавим конкретно комментарии post.comments  */}
				{/* <PostContent post={post} />
					<Comments comments={post.comments} postId={post.id} /> */}
				{/* теперь принимаем эти данные в каждом из компонентов PostContent и Comments, см. файлы компонентов */}
				<PostContent post={post} />
				<Comments comments={post.comments} postId={post.id} />
			</div>
		);

	// разобьем верстку страницы статьи на две части - содержимое статьи и блок комментариев, то есть создадим два компонента PostContent и Comments. Здесь обработаем ошибку - если есть ошибка, то выводим сообщение об ошибке, а если нет ошибки, то отображаем контент

	// используем условный рендеринг. Либо создание новой статьи либо редактирование статьи в любом случае отображаем форму для статьи, а вдругом случае отображаем контент с комментариями
	// для этой части доступ ограниченный PrivateContent
	// Мы проверяем ошибку. Если она есть, то показываем, что страницы не существует, а если ошибки нет, то показываем статью без ошибки
	return error ? <Error error={error} /> : SpecificPostPage;
};

export const Post = styled(PostContainer)`
	margin: 40px 0;
	padding: 0 80px;
`;
