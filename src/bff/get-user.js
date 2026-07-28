import { getUsers } from './get-users';
// Создадим функцию getUser, которая запрашивает список всех пользователей getUsers и потом по этому wсписку ищет нужного по логину
// здесь нужно указывать async, await, потому что мы указываем несколько операций
export const getUser = async (loginToFind) => {
	const users = await getUsers();
	return users.find(({ login }) => login === loginToFind);
};
