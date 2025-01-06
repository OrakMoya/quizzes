import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { quizzes, quizzes, quizzes, users } from "$lib/server/db/schema";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";


/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) return redirect(302, '/login');

	let quizzes_data = await db.select()
		.from(quizzes)
		.where(eq(quizzes.owner_uuid, user.uuid));

	return { quizzes: quizzes_data };

}
