// создадим страницу Статья
// Страница Статья доступна для всех пользователей, поэтому сообщение об ошибке показывать не нужно. То есть нам не потребуется заворачивать содержимое в тег Content, который проверяет на ошибку
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Comments, PostContent } from './components';
import { useServerRequest } from '../../hooks';
import { loadPostAsync } from '../../actions';
import { selectPost } from '../../selectors';
import styled from 'styled-components';

const PostContainer = ({ className }) => {
	// будем использовать redux store, чтобы хранить данные о странице, так что будем принимать данные из redux store с помощью селекторов
	const dispatch = useDispatch();
	// получаем параметры
	const params = useParams();
	const requestServer = useServerRequest();
	// получаем пост, который загрузится асинхронно при открытии данной страницы Статья
	const post = useSelector(selectPost);
	// console.log(post);

	// в useEffect получим данные с сервера о названии статьи, чтобы отобразить в заголовке H2 и вообще данные для статьи
	useEffect(() => {
		// задиспатчим асинхронный экшен loadPost, а какого поста мы узнаем из id, котоорый мы возьмем из адреса с помощью пакета React Router, хука useParams. Мы добавили requestServer и чтобы его использовать добавим его передать в экшен этот requestServer. Этот диспатч загружает нам данные асинхронно, а когда ответ приходит, то в файле load-post-async мы вызываем диспатч уже с синхронным экшеном dispatch(setPostData(postData)); Этот экшен в свою очередь устанавливает state в redux store и мы оттуда сможем уже их получить с помощью селектора. Для этого добавим селектор в папку selectors файл select-post.js

		dispatch(loadPostAsync(requestServer, params.id));
		// подготовим асинхронный экшен loadPost, для этого в папке action создадим файл load-post.js
	}, [dispatch, requestServer, params.id]);
	return (
		// разобьем верстку страницы статьи на две части - содержимое статьи и блок комментариев, то есть создадим два компонента PostContent и Comments
		<div className={className}>
			{/* отправим полученные с помощью селектора данные внутрь компонета post и в комментарии в компонент Comments также отрпавим конкретно комментарии post.comments  */}
			<PostContent post={post} />
			<Comments comments={post.comments} postId={post.id} />
			{/* теперь принимаем эти данные в каждом из компонентов PostContent и Comments, см. файлы компонентов */}
		</div>
	);
};

export const Post = styled(PostContainer)`
	margin: 40px 0;
	padding: 0 80px;
`;
