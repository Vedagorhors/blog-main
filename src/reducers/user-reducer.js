import { ACTION_TYPE } from '../actions';
import { ROLE } from '../constants';

const initialUserState = {
	// это данные о пользователе. session: null - если null, значит юзер не авторизованный
	id: null,
	login: null,
	roleId: ROLE.GUEST,
	session: null,
};

export const userReducer = (state = initialUserState, action) => {
	switch (action.type) {
		// экшен SET_SESSION, который нам установит сессию
		case ACTION_TYPE.SET_USER:
			return {
				// разворачиваем старый стейт, потому что полагаться на ответ сервера не стоит, ведь он может и недоприслать какие-то данные и тогда стейт сломается, а так мы сможем его сохранить и ошибку обработать отдельно. Поэтому если нам нужно вернуть всего лишь action.payload, то лучше делать это через разворачивание
				...state,
				...action.payload,
			};

		// на сервер то данные уйдут, но нужно обработать данные и на клиенте. Добавляем новый обработчик экшена
		case ACTION_TYPE.LOGOUT:
			// сбросим стейт до начального. Здесь не нужно разврачивать сначала старый стейт (...state), потому что в начальном мы уверены, он точно корректный. Кстати, если в экшене просто что-то возвращается, то можно для case не писать фигурные скобки
			return initialUserState;

		default:
			return state;
	}
};
