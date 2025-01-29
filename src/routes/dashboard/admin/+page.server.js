import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { getUserByUUID } from "$lib/server/utils";
import { error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";


/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		return error(403);
	}

	if (user.role !== 'admin' && user.role !== 'owner') {
		return redirect(302, '/dashboard');
	}

	let user_rows = await db.select({
		uuid: users.uuid,
		username: users.username,
		email: users.email,
		role: users.role,
	})
		.from(users);

	return { users: user_rows };

}

/** @type {import("./$types").Actions} */
export let actions = {
	changeRole: async ({ cookies, request }) => {
		let user = await getCurrentUser(cookies);

		if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
			return error(403);
		}

		let data = await request.formData();
		let userUUID = data.get('user_uuid')?.toString();
		let newRole = data.get('new_role')?.toString();

		if (!userUUID) {
			return error(400);
		}
		if (!newRole || (newRole !== 'admin' && newRole !== 'user')) {
			return error(400);
		}

		let targetUser = await getUserByUUID(userUUID);
		if (!targetUser) {
			return error(404);
		}

		await db.update(users)
			.set({
				role: newRole
			}).where(eq(users.uuid, targetUser.uuid));

		return { success: true };
	},
	changeOwner: async ({ cookies, request }) => {
		let user = await getCurrentUser(cookies);

		if (!user || user.role !== 'owner') {
			return error(403);
		}

		let data = await request.formData();
		let userUUID = data.get('user_uuid')?.toString();

		if (!userUUID) {
			return error(400);
		}

		let targetUser = await getUserByUUID(userUUID);
		if (!targetUser) {
			return error(404);
		}

		await db.update(users)
			.set({
				role: 'admin'
			})
			.where(eq(users.uuid, user.uuid));

		await db.update(users)
			.set({
				role: 'owner'

			})
			.where(eq(users.uuid, targetUser.uuid));

		return {success: true};
	},
	delete: async ({cookies, request}) => {
		let user = await getCurrentUser(cookies);

		if (!user || user.role !== 'owner') {
			return error(403);
		}

		let data = await request.formData();
		let userUUID = data.get('user_uuid')?.toString();

		if (!userUUID) {
			return error(400);
		}

		let targetUser = await getUserByUUID(userUUID);
		if (!targetUser) {
			return error(404);
		}

		if(targetUser.uuid === user.uuid && user.role === 'owner'){
			return fail(400, {message: 'Can\'t delete app owner.'});
		}

		await db.delete(users)
			.where(eq(users.uuid, targetUser.uuid));

		if(targetUser.uuid === user.uuid){
			return redirect(302, '/');
		}

		return {success: true};
	}

}
