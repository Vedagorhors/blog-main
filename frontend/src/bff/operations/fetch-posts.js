import { getComments, getPosts } from '../api';
import { getCommentsCount } from '../utils';
import { ROLE } from '../constants';

export const fetchPosts = async (searchPhrase, page, limit) => {
	const [postsEnvelope, comments] = await Promise.all([
		getPosts(searchPhrase, page, limit),
		getComments(),
	]);

	return {
		error: null,
		res: {
			posts: postsEnvelope.data.map((post) => ({
				...post,
				commentsCount: getCommentsCount(comments, post.id),
			})),
			lastPage: postsEnvelope.pages,
		},
	};
};
