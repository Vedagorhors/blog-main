import { transformSession } from '../transformers/';

export const getSession = async (hash) =>
	fetch(`http://localhost:3005/sessions?hash=${hash}`)
		.then((loadedSession) => loadedSession.json())
		.then(([loadedSession]) => loadedSession && transformSession(loadedSession));
// здесь так применял логирование:
// .then(([loadedSession]) => {
// 	console.log('getSession', loadedSession);
// 	return loadedSession && transformSession(loadedSession);
// });

// теперь добавим этот трансформер, создадим файл transform-session.js
