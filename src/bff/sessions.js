import { getSession, addSession, deleteSession } from './api';
export const sessions = {
	async create(user) {
		const hash = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

		await addSession(hash, user);

		return hash;
	},

	async remove(hash) {
		const session = await getSession(hash);
		if (!session) {
			return;
		}
		deleteSession(session.id);
	},
	async access(hash, accessRoles) {
		const dbSession = await getSession(hash);

		return !!dbSession?.user && accessRoles.includes(dbSession.user.roleId);
	},
};
