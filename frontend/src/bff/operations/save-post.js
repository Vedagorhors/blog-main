import { addPost, updatePost } from '../api';
import { ROLE } from '../constants';
import { sessions } from '../sessions';
import { transformPost } from '../transformers';

export const savePost = async (hash, newPostData) => {
	const accessRoles = [ROLE.ADMIN];

	const access = await sessions.access(hash, accessRoles);
	if (!access) {
		return {
			error: 'Доступ запрещен',
			res: null,
		};
	}

	const savedPost =
		newPostData.id === ''
			? await addPost(newPostData.imageUrl, newPostData.title, newPostData.content)
			: await updatePost(
					newPostData.id,
					newPostData.imageUrl,
					newPostData.title,
					newPostData.content,
				);

	return {
		error: null,
		res: transformPost(savedPost),
	};
};
