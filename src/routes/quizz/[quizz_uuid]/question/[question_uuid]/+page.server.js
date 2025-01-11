import { db } from "$lib/server/db";
import { question_parts, question_parts, questions, quizzes } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";
import { eq, like } from "drizzle-orm";



/** @type {import("./$types").PageServerLoad} */
export async function load({ request, params }) {
	let quizz_uuid = params.quizz_uuid;
	if (!quizz_uuid || quizz_uuid.length !== 5) {
		return fail(404);
	}

	let quizz = (await db.select()
		.from(quizzes)
		.where(like(quizzes.uuid, quizz_uuid + "%"))
		.limit(1)).at(0);

	if (!quizz) {
		return fail(404);
	}

	let question = (await db.select()
		.from(questions)
		.where(eq(questions.quizz_uuid, quizz.uuid))
		.limit(1)).at(0);

	if (!question) {
		return fail(404);
	}

	let question_parts_rows = await db.select()
		.from(question_parts)
		.where(eq(question_parts.question_uuid, question.uuid));

	return {question, parts: question_parts_rows};
}
