import { ACTION_TYPE } from './action-type';

// создадим синхронный экшен для асинхронного хука loadPost. Здесь мы принимаем postData и должны вернуть объект. При этом нужно подготовить ACTION_TYPE в файле action-type.js
export const setPostData = (postData) => ({
	type: ACTION_TYPE.SET_POST_DATA,
	payload: postData,
});

// можно также сделать янвый возврат объекта (выше пирведен пример неявного возврата без return), это будет одно и тоже
// export const setPostData = (postData) => {
// 	return {
// 		type: ACTION_TYPE,
// 		payload: postData,
// 	};
// };
