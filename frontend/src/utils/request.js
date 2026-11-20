// утилита выполняет фетч на сервер. Утилита отвечает за то, чтобы правильные аргументы отдать в fetch, а дальше распарсить запрос из json и превратить его в объект.
// Используем эту функцию, чтобы общаться с бэкендом

export async function request(url, method, data) {
	// Префикс добавляем один раз здесь: /register превращается в /api/register.
	const response = await fetch('/api' + url, {
		headers: {
			'content-type': 'application/json',
		},
		method: method || 'GET',
		body: data === undefined ? undefined : JSON.stringify(data),
	});
	// Успешный HTTP-ответ тоже может содержать { error }, как в материалах курса.
	// Превращаем все ошибки в отклонённый Promise: .then() выполняется только при успехе.
	let result;
	try {
		result = response.status === 204 ? {} : await response.json();
	} catch {
		throw new Error(`Сервер вернул некорректный JSON (HTTP ${response.status})`);
	}
	if (!result || typeof result !== 'object') {
		throw new Error('Сервер вернул некорректный ответ');
	}
	if (!response.ok || result.error) {
		const error = new Error(result.error || `Ошибка запроса: HTTP ${response.status}`);
		error.status = response.status;
		throw error;
	}
	return result;
}
