export const ACTION_TYPE = {
	SET_USER: 'SET_USER',
	LOGOUT: 'LOGOUT',
	SET_POST_DATA: 'SET_POST_DATA',
	OPEN_MODAL: 'OPEN_MODAL',
	CLOSE_MODAL: 'CLOSE_MODAL',
	RESET_POST_DATA: 'RESET_POST_DATA',
	// для интеграции фронтенда с бэкендом создадим ADD_COMMENT и REMOVE_COMMENT, потому что у модератора и администратора есть возможность добавлять и удалять комментарии и мы не будем перезагружать целый пост просто из-за удаления одного комментария.
	// Делаем для этого два action-creator
	ADD_COMMENT: 'ADD_COMMENT',
	REMOVE_COMMENT: 'REMOVE_COMMENT',
};
