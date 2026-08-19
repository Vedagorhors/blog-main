import { ACTION_TYPE } from './action-type';

export const openModal = (modalParams) => ({
	type: ACTION_TYPE.OPEN_MODAL,
	payload: modalParams,
});

// так как у нас не тело функции, а объект, то нужно фигырные скобки брать в обычные ({})
// сами параметры modalParams сюда передаваемые укажем в файле редюсера app-reducer.js
