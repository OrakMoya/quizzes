import { getCurrentUser } from '$lib/auth/auth';
import { db } from '$lib/server/db';
import { users, users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import * as bcrypt from "bcrypt";
import { eq } from 'drizzle-orm';

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
			password: data.get('password'),
			password_confirmation: data.get('password_confirmation')
		};
		if (!exploded.username)
			return fail(400, { username: exploded.username, username_missing: true });
		if (!exploded.email)
			return fail(400, { email: exploded.email, email_missing: true });
		if (!exploded.password)
			return fail(400, { password: exploded.password, password_missing: true });
		if (!exploded.password_confirmation)
			return fail(400, { password: exploded.password, password_confirmation_missing: true });
		if (exploded.password_confirmation !== exploded.password) {
			return fail(400, { password: exploded.password, passwords_dont_match: true });
		}


		let username_taken = (await db.select({ username: users.username }).from(users).where(eq(users.username, exploded.username.toString())))
			.length;
		if (username_taken) {
			return fail(400, { username: exploded.username, username_taken: true });
		}

		let email_taken = (await db.select({ email: users.email }).from(users).where(eq(users.email, exploded.email.toString())))
			.length;
		if (email_taken) {
			return fail(400, { email: exploded.email, email_taken: true });
		}


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
