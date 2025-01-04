import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";


export async function load({ params }) {
	/** @type {typeof users.$inferInsert} */
	const user = {
		uuid: crypto.randomUUID(),
		username: "gaser",
		password: "gas",
		email: "gas",
	}
	await db.insert(users).values(user);
	return {
		users: await db.select().from(users)
	};
}


