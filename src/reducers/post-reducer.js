import { ACTION_TYPE } from '../actions';

const initialPostState = {
	// здесь будет post. Зададим начальные данные для статьи здесь. Наименования возьмем из файла README.md (Схема для redux store (на клиенте))
	id: '',
	title: '',
	imageUrl: '',
	content: '',
	publishedAt: '',
	comments: [],
};

export const postReducer = (state = initialPostState, action) => {
	// console.log('postReducer', state, action);

	switch (action.type) {
		case ACTION_TYPE.SET_POST_DATA:
			// console.log('postReducer', state, action);
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};
