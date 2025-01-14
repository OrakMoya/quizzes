import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { APP_SECRET } from "$env/static/private";


/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 * @returns {Promise<typeof users.$inferInsert | null>} 
 */
export async function getCurrentUser(cookies) {
	let token = cookies.get('token');

	/**
	 * @type {(typeof users.$inferInsert)[]}
	 */
	let rows = [];

	if (token) {
		/** @type {any} */
		let token_data = jwt.verify(token, APP_SECRET, { complete: true });

		rows = await db.select().from(users)
			.where(eq(users.uuid, token_data.payload.uuid))
			.limit(1);
		let row = rows.at(0)

		if (!row)
			throw new Error("Token expired.");

		// Refresh
		let ts = Date.now() / 1000;
		if ((ts - token_data.iat) < 600) {
			let token = jwt.sign({ uuid: row.uuid }, APP_SECRET, { expiresIn: '60m' });
			cookies.set('token', token, { path: '/' });
		}
	}
	return rows.at(0) ?? null;
}

/**
 * @param {import("@sveltejs/kit").Cookies} cookies
 */
export async function logout(cookies) {
	cookies.delete('token', { path: '/' });
}

/**
* @param {{email: string, password: string}} params 
* @returns {Promise<string>}
*/
export async function attemptLogin({ email, password }) {
	let userResults = await db
		.select()
		.from(users)
		.where(eq(users.email, email.toString()))
		.limit(1);

	let user = userResults.at(0);

	if (!user) {
		throw new Error('User with email ' + email + ' not found.');
	}

	let matches = await bcrypt.compare(password, user.password);

	if (!matches) {
		throw new Error('Incorrect password for user with email ' + user.email);
	}

	let token = jwt.sign({ uuid: user.uuid }, APP_SECRET, { expiresIn: '60m' });
	return token;
}
