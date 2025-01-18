import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { answers, question_parts, questions, quizzes, sessions } from "$lib/server/db/schema";
import { getQuestion, getSessionByUUID } from "$lib/server/utils";
import { fromDate } from "@internationalized/date";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, asc, desc, eq, isNull, like, notInArray, param, sql } from "drizzle-orm";



/** @type {import("./$types").PageServerLoad} */
export async function load({ request, params, cookies }) {
	let quizz_uuid = params.quizz_uuid;
	if (!quizz_uuid || quizz_uuid.length !== 5) {
		return error(404);
	}

	let quizz = (await db.select()
		.from(quizzes)
		.where(like(quizzes.uuid, quizz_uuid + "%"))
		.limit(1)).at(0);

	if (!quizz) {
		return error(404);
	}

	let session = await getSessionByUUID(cookies.get('quizz_session') ?? "");
	if (!session) {
		return error(404);
	}

	let answers_rows = db.select()
		.from(answers)
		.where(
			and(
				eq(answers.question_uuid, params.question_uuid),
				eq(answers.session_uuid, session.uuid)
			)
		)
		.all();

	if (!answers_rows.length) {
		return redirect(302, '/');
	}

	let question = answers_rows[0].question_copy;
	let parts = answers_rows.map((answer) => {
		answer.question_part_copy.correct_data = [];
		return answer.question_part_copy;
	}
	);

	return { question, parts, time_left: fromDate(session.created_at, 'UTC').add({ minutes: session.duration_minutes }).toDate().getTime() - Date.now() };
}

/** @type {import("./$types").Actions} */
export let actions = {
	next: async ({ request, params, cookies }) => {

		// Get the user
		let user = await getCurrentUser(cookies);
		if (!user) {
			return error(403);
		}

		// Get the quizz
		let quizz_uuid = params.quizz_uuid;
		if (!quizz_uuid || quizz_uuid.length !== 5) {
			return error(404);
		}

		let quizz = (await db.select()
			.from(quizzes)
			.where(like(quizzes.uuid, quizz_uuid + "%"))
			.limit(1)).at(0);
		if (!quizz) {
			return error(404);
		}

		// Get the session
		let session = (
			await db.select()
				.from(sessions)
				.where(and(eq(sessions.user_uuid, user.uuid), eq(sessions.quizz_uuid, quizz.uuid)))
				.orderBy(desc(sessions.created_at))
				.limit(1)
		).at(0);
		if (!session) {
			return error(400);
		}

		// Get the submitted answers
		let partsJson = (await request.formData()).get('data');
		if (!partsJson) {
			return error(400);
		}
		/** @type {((typeof question_parts.$inferInsert) & {answer_data: any})[]} */
		let submitted_parts = JSON.parse(partsJson.toString());

		for (let i = 0; i < submitted_parts.length; i++) {
			let part = submitted_parts[i];
			await db.update(answers)
				.set({ answers: part.answer_data, updated_at: sql`(unixepoch())` })
				.where(
					and(
						eq(answers.question_part_uuid, part.uuid),
						eq(answers.session_uuid, session.uuid)
					)
				);
		}

		let current_question_position = (await db.select()
			.from(answers)
			.where(and(
				eq(answers.session_uuid, session.uuid),
				eq(answers.question_uuid, params.question_uuid)
			)))
			.at(0)?.question_copy.position ?? 1;

		let all_questions = (await db.select()
			.from(answers)
			.where(
				eq(answers.session_uuid, session.uuid),
			))
			.filter(q => q.question_copy.position > current_question_position);

		let next = all_questions
			.sort((a, b) => a.question_copy.position - b.question_copy.position)
			.at(0);

		if (next) {
			return redirect(302, '/quizz/' + params.quizz_uuid + '/question/' + next.question_uuid);
		}

		cookies.delete('quizz_session', { path: '/' });
		await db.update(sessions)
			.set({ in_progress: 0, updated_at: sql`(unixepoch())` })
			.where(eq(sessions.uuid, session.uuid))

		return redirect(302, '/quizz/' + params.quizz_uuid);
	},
	back: async ({ request, params, cookies }) => {

		// Get the user
		let user = await getCurrentUser(cookies);
		if (!user) {
			return error(403);
		}

		// Get the quizz
		let quizz_uuid = params.quizz_uuid;
		if (!quizz_uuid || quizz_uuid.length !== 5) {
			return error(404);
		}

		let quizz = (await db.select()
			.from(quizzes)
			.where(like(quizzes.uuid, quizz_uuid + "%"))
			.limit(1)).at(0);
		if (!quizz) {
			return error(404);
		}

		// Get the session
		let session = (
			await db.select()
				.from(sessions)
				.where(and(eq(sessions.user_uuid, user.uuid), eq(sessions.quizz_uuid, quizz.uuid)))
				.orderBy(desc(sessions.created_at))
				.limit(1)
		).at(0);
		if (!session) {
			return error(400);
		}

		// Get the submitted answers
		let partsJson = (await request.formData()).get('data');
		if (!partsJson) {
			return error(400);
		}
		/** @type {((typeof question_parts.$inferInsert) & {answer_data: any})[]} */
		let submitted_parts = JSON.parse(partsJson.toString());

		for (let i = 0; i < submitted_parts.length; i++) {
			let part = submitted_parts[i];
			await db.update(answers)
				.set({ answers: part.answer_data, updated_at: sql`(unixepoch())` })
				.where(
					and(
						eq(answers.question_part_uuid, part.uuid),
						eq(answers.session_uuid, session.uuid)
					)
				);
		}

		let current_question_position = (await db.select()
			.from(answers)
			.where(and(
				eq(answers.session_uuid, session.uuid),
				eq(answers.question_uuid, params.question_uuid)
			)))
			.at(0)?.question_copy.position ?? 1;

		let all_questions = (await db.select()
			.from(answers)
			.where(
				eq(answers.session_uuid, session.uuid),
			))
			.filter(q => q.question_copy.position < current_question_position);

		let next = all_questions
			.sort((a, b) => b.question_copy.position - a.question_copy.position)
			.at(0);

		if (next) {
			return redirect(302, '/quizz/' + params.quizz_uuid + '/question/' + next.question_uuid);
		}

		cookies.delete('quizz_session', { path: '/' });
		await db.update(sessions)
			.set({ in_progress: 0, updated_at: sql`(unixepoch())` })
			.where(eq(sessions.uuid, session.uuid))

		return redirect(302, '/quizz/' + params.quizz_uuid);
	}
}
