// утилита выполняет фетч на сервер. Утилита отвечает за то, чтобы правильные аргументы отдать в fetch, а дальше распарсить запрос из json и превратить его в объект.
// Используем эту функцию, чтобы общаться с бэкендом

export function request(url, method, data) {
	// Префикс добавляем один раз здесь: /register превращается в /api/register.
	return fetch('/api' + url, {
		headers: {
			'content-type': 'application/json',
		},
		method: method || 'GET',
		body: data ? JSON.stringify(data) : undefined,
	}).then((res) => res.json());
}
