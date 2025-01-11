import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { answers, question_parts, question_parts, questions, quizzes, sessions } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { and, asc, desc, eq, like, notInArray } from "drizzle-orm";
import { on } from "svelte/events";



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
		.where(and(eq(questions.quizz_uuid, quizz.uuid), eq(questions.uuid, params.question_uuid)))
		.limit(1)).at(0);

	if (!question) {
		return fail(404);
	}
	console.log("q ", question);

	let question_parts_rows = await db.select()
		.from(question_parts)
		.where(eq(question_parts.question_uuid, question.uuid));

	return { question, parts: question_parts_rows ?? [] };
}

/** @type {import("./$types").Actions} */
export let actions = {
	default: async ({ request, params, cookies }) => {
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
			.where(and(eq(questions.quizz_uuid, quizz.uuid), eq(questions.uuid, params.question_uuid)))
			.limit(1)).at(0);

		if (!question) {
			return fail(404);
		}

		let user = await getCurrentUser(cookies);
		if (!user) {
			return fail(403);
		}

		let session = (
			await db.select()
				.from(sessions)
				.where(and(eq(sessions.user_uuid, user.uuid), eq(sessions.quizz_uuid, quizz.uuid)))
				.orderBy(desc(sessions.created_at))
				.limit(1)
		).at(0);

		if (!session) {
			return fail(400);
		}

		let parts = await db.select()
			.from(question_parts)
			.where(eq(question_parts.question_uuid, question.uuid));

		if (!parts) {
			return fail(400);
		}

		let partsJson = (await request.formData()).get('data');
		if (!partsJson) {
			return fail(400);
		}
		/** @type {((typeof question_parts.$inferInsert) & {answer_data: any})[]} */
		let submitted_parts = JSON.parse(partsJson.toString());

		await db.insert(answers)
			.values(
				[...submitted_parts.map((element) => {
					return {
						uuid: crypto.randomUUID(),
						question_uuid: question.uuid,
						user_uuid: user.uuid,
						session_uuid: session.uuid,
						data: {
							part: parts.find((part) => part.uuid === element.uuid),
							answers: element.answer_data
						}
					};
				})]
			);

		let unaswered_questions = db.select()
			.from(questions)
			.where(and(notInArray(questions.uuid,
				db.selectDistinct({ uuid: answers.question_uuid })
					.from(answers)
					.where(eq(answers.session_uuid, session.uuid))
			), eq(questions.quizz_uuid, quizz.uuid)))
			.orderBy(asc(questions.position))
			.all();
		let next = unaswered_questions.at(0);

		if (next) {
			return redirect(302, '/quizz/' + params.quizz_uuid + '/question/' + next.uuid);
		}
		return redirect(302, '/');
	}
}
