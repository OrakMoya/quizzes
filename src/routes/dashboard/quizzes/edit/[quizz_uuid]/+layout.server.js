import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { questions, quizzes } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

/** @type {import("./$types").LayoutServerLoad} */
export async function load({ cookies, params }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		return error(403);
	}
	let quizz = (await db.select()
		.from(quizzes)
		.where(eq(quizzes.uuid, params.quizz_uuid))
		.limit(1)).at(0);

	if (!quizz) {
		return error(404);
	}

	let questions_rows = await db.select()
		.from(questions)
		.where(eq(questions.quizz_uuid, params.quizz_uuid));

	return { questions: questions_rows };
}

