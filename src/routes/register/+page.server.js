import { getCurrentUser } from '$lib/auth/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import * as bcrypt from "bcrypt";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	if (await getCurrentUser(cookies))
		return redirect(302, '/');
	return {};
}

/** @satisfies {import('../login/$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		let data = await request.formData();
		let exploded = {
			username: data.get('username'),
			email: data.get('email'),
			password: data.get('password')
		};
		if (!exploded.username)
			return fail(400, { username: exploded.username, missing: true });
		if (!exploded.email)
			return fail(400, { email: exploded.email, missing: true });
		if (!exploded.password)
			return fail(400, { password: exploded.password, missing: true });

		let salt = await bcrypt.genSalt(10);
		let pwd_hash = await bcrypt.hash(exploded.password.toString(), salt);

		await db.insert(users).values({
			uuid: crypto.randomUUID(),
			username: exploded.username?.toString(),
			email: exploded.email?.toString(),
			role: 'user',
			password: pwd_hash
		});

		return redirect(302, '/dashboard');
	}
}
