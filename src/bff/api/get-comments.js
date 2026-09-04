import { transformComment } from '../transformers';

const ALL_COMMENTS_URL = 'http://localhost:3005/comments';

export const getComments = (postId) =>
	fetch(ALL_COMMENTS_URL)
		.then((loadedComments) => loadedComments.json())
		.then((comments) =>
			(postId === undefined
				? comments
				: comments.filter(({ post_id }) => post_id === postId)
			).map(transformComment),
		);
