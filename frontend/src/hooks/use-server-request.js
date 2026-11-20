// Учебный пример прежней работы с bff и json-server.
// Хук больше не вызывается компонентами и не экспортируется из hooks/index.js.
// Код оставлен для сравнения с новой утилитой utils/request.js.
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectUserSession } from '../selectors';
import { server } from '../bff';

export const useServerRequest = () => {
	const session = useSelector(selectUserSession);

	return useCallback(
		(operation, ...params) => {
			const request = ['register', 'authorize', 'fetchPost', 'fetchPosts'].includes(
				operation,
			)
				? params
				: [session, ...params];
			return server[operation](...request);
		},
		[session],
	);
};
