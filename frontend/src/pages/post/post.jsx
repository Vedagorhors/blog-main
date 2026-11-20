import { useEffect, useLayoutEffect, useState } from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Comments, PostContent, PostForm } from './components';
import { Error, PrivateContent } from '../../components';
// import { useServerRequest } from '../../hooks';
import { loadPostAsync, RESET_POST_DATA } from '../../actions';
import { selectPost } from '../../selectors';
import { ROLE } from '../../constants';
import styled from 'styled-components';

const PostContainer = ({ className }) => {
	const [loadResult, setLoadResult] = useState(null);
	const dispatch = useDispatch();
	const params = useParams();

	// Состояние загрузки привязано к id: при переходе между статьями старый ответ не виден.
	const isLoading = !loadResult || loadResult.id !== params.id;
	const error = isLoading ? null : loadResult.error;

	const isCreating = useMatch('/post');

	const isEditing = useMatch('/post/:id/edit');

	// const requestServer = useServerRequest();
	const post = useSelector(selectPost);

	useLayoutEffect(() => {
		dispatch(RESET_POST_DATA);
	}, [dispatch, isCreating, params.id]);

	useEffect(() => {
		if (isCreating) {
			return;
		}
		// dispatch(loadPostAsync(requestServer, params.id)) — прежний вызов через bff.
		let active = true;
		dispatch(loadPostAsync(params.id, () => active))
			.then(() => { if (active) setLoadResult({ id: params.id, error: null }); })
			.catch((error) => { if (active) setLoadResult({ id: params.id, error: error.message }); });
		return () => { active = false; };
		// }, [dispatch, requestServer, params.id, isCreating]);
	}, [dispatch, params.id, isCreating]);

	if (isLoading && !isCreating) {
		return <div role="status">Загрузка статьи...</div>;
	}

	const SpecificPostPage =
		isCreating || isEditing ? (
			<PrivateContent access={[ROLE.ADMIN]}>
				<div className={className}>
					<PostForm key={post.id} post={post} />
				</div>
			</PrivateContent>
		) : (
			<div className={className}>
				{}
				{}
				{}
				{}
				{}
				{}
				<PostContent post={post} />
				<Comments comments={post.comments} postId={post.id} />
			</div>
		);

	return !isCreating && error ? <Error error={error} /> : SpecificPostPage;
};

export const Post = styled(PostContainer)`
	margin: 40px 0;
	padding: 0 80px;
`;
