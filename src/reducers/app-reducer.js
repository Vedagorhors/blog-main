import { ACTION_TYPE } from '../actions';

// Нам потребуется держать дополнительный флаг в стейте, для него нам потребуется новый редюсер. Здесь будут храниться данные о приложении в целом, таки как - надо ли сбросить форму.
const initialAppState = {
	// вводим флаг, который сигнализирует случился или не случился logout
	wasLogout: false,
};

export const appReducer = (state = initialAppState, action) => {
	switch (action.type) {
		// здесь нам потребуется реагировать на экшен logout. Дело в том, что наши экшены диспатсятся по всем редюсерам
		case ACTION_TYPE.LOGOUT:
			// вернем новый стейт, в котором изменится одно поле wasLogout, то есть был логаут. Здесь мы возвращаем логаут измененным. Инвертируем стейт возлогаут итогда у нас при каждом нажатии на logout будет меняться флаг wasLogout с false на true и наоборрот и так до бесконечности. Что нам это даст? Теперь переходим в файл authorization.jsx к компоненту useEffects
			return {
				...state,
				wasLogout: !state.wasLogout,
			};
		default:
			return state;
	}
};
