import { deserialize } from "$app/forms";
import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { answers, question_parts, questions, questions, questions, quizzes, sessions, users } from "$lib/server/db/schema";
import { get_results } from "$lib/server/utils";
import { fail, redirect } from "@sveltejs/kit";
import { and, asc, desc, eq, gt, gte, inArray, like } from "drizzle-orm";
import { get } from "svelte/store";

/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies, params }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		return fail(403);
	}

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

	let session = (
		await db.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.user_uuid, user.uuid),
					eq(sessions.quizz_uuid, quizz.uuid),
					eq(sessions.uuid, cookies.get('quizz_session') ?? ""),
					eq(sessions.in_progress, 1)
				)
			)
			.orderBy(desc(sessions.created_at))
			.limit(1)
	).at(0) ?? null;

	console.log(session);

	let past_sessions = await db.select()
		.from(sessions)
		.where(and(eq(sessions.user_uuid, user.uuid), eq(sessions.quizz_uuid, quizz.uuid)));

	let past_results = await Promise.all(past_sessions.map(async session => await get_results(session.uuid)));

	return { session, past_results };
}


/** @type {import("./$types").Actions} */
export let actions = {
	new: async ({ params, cookies }) => {
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

		let user = await getCurrentUser(cookies);
		if (!user) {
			return fail(403);
		}

		let questions_rows = await db.select()
			.from(questions)
			.where(eq(questions.quizz_uuid, quizz.uuid));
		let question_uuids = questions_rows
			.map((question) => question.uuid);
		let question_parts_rows = await db.select()
			.from(question_parts)
			.where(inArray(question_parts.question_uuid, question_uuids));

		let session_uuid = crypto.randomUUID();
		await db.insert(sessions)
			.values({
				uuid: session_uuid,
				quizz_uuid: quizz.uuid,
				user_uuid: user.uuid,
				in_progress: 1
			});

		/**
		 * @type {(typeof answers.$inferInsert)[]}
		 */
		let values = [];
		for (let index = 0; index < question_parts_rows.length; index++) {
			let part = question_parts_rows[index];
			let question =
				(await db.select().from(questions)
					.where(eq(questions.uuid, part.question_uuid))
				).at(0);
			if (!question) throw Error("Something went wrong.");

			values.push({
				uuid: crypto.randomUUID(),
				user_uuid: user.uuid,
				session_uuid: session_uuid,
				question_part_uuid: part.uuid,
				question_uuid: part.question_uuid,
				question_copy: question,
				question_part_copy: part,
				answers: null
			});
		}

		await db.insert(answers)
			.values(values);

		let first_question = values
			.map(value => value.question_copy)
			.toSorted((a, b) => a.position - b.position)[0];


		cookies.set('quizz_session', session_uuid, { path: '/' });

		return redirect(302, '/quizz/' + params.quizz_uuid + '/question/' + first_question.uuid);
	},
	continue: async ({ cookies, params, request }) => {
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
		)
			.at(0);

		if (!session) {
			return fail(404);
		}

		let last_answer = (await db.select()
			.from(answers)
			.where(eq(answers.session_uuid, session.uuid))
			.orderBy(desc(answers.created_at))).at(0);

		let next_question;
		if (last_answer) {
			let last_question = (await db.select()
				.from(questions)
				.where(eq(questions.uuid, last_answer.question_uuid))
				.limit(1)).at(0);

			if (!last_question) {
				throw Error("Something went wrong");
			}

			next_question = (await db.select()
				.from(questions)
				.where(and(eq(questions.quizz_uuid, session.quizz_uuid), gt(questions.position, last_question.position)))
				.limit(1)).at(0);

			console.log(next_question);

			if (!next_question) {
				throw Error("Something went wrong");
			}

		}
		else {
			next_question = (await db.select()
				.from(questions)
				.where(eq(questions.quizz_uuid, quizz.uuid))
				.orderBy(asc(questions.position)))[0];
		}

		cookies.set('quizz_session', session.uuid, { path: '/' });
		return redirect(302, '/quizz/' + params.quizz_uuid + '/question/' + next_question.uuid);
	}


}
