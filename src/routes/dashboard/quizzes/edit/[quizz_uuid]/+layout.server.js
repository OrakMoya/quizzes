import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { question_parts, questions, quizzes } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { count, eq, isNull } from "drizzle-orm";

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

	let empty_questions = (await db.select({count: count()})
		.from(questions)
		.leftJoin(question_parts, eq(questions.uuid, question_parts.question_uuid))
		.where(isNull(question_parts.question_uuid))).at(0)?.count ?? 0;

	return { questions: questions_rows, quizz, empty_questions };
}

