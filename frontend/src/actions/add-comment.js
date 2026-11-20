import { ACTION_TYPE } from './action-type';

export const addComment = (comment) => ({
	type: ACTION_TYPE.ADD_COMMENT,
	payload: comment,
});

// теперь используем add-comment  в add-comment-async
