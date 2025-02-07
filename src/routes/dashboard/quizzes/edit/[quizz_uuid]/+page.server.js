import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { answers, question_parts, questions, quizzes, sessions, users } from "$lib/server/db/schema";
import { getResults, getQuizzByShortUUID, getSessionsOfQuizz, getUserByUUID, getSessionByUUID, getQuestion, getFinishedSessionsOfQuizz } from "$lib/server/utils";
import { error, fail, redirect } from "@sveltejs/kit";
import { count, eq, isNull, max, param } from "drizzle-orm";
import { parse } from "svelte/compiler";


/** @type {import("./$types").PageServerLoad} */
export async function load({ params, cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		return error(403);
	}

	let quizz = await getQuizzByShortUUID(params.quizz_uuid);
	if (!quizz) {
		return error(404);
	}

	let current_sessions = await getFinishedSessionsOfQuizz(quizz.uuid) ?? [];
	let expanded_sessions = await Promise.all(current_sessions.map(async session => {
		let result = await getResults(session.uuid);
		let user = await getUserByUUID(session.user_uuid);

		if (!result || !user) {
			throw Error("Something went wrong");
		}

		/** @type {typeof session & {result: any , user: typeof users.$inferInsert}} */
		let new_session = {
			...session,
			result,
			user
		}
		return new_session;
	}))
	let stripped_sessions = expanded_sessions.map(session => ({
		uuid: session.uuid,
		quizz_uuid: session.quizz_uuid,
		user_uuid: session.user_uuid,
		created_at: session.created_at,
		updated_at: session.updated_at,
		result: {
			achieved: session.result.achieved,
			total: session.result.total
		},
		user: {
			username: session.user.username
		}
	}));



	return { sessions: stripped_sessions}
}


/** @type {import("./$types").Actions} */
export const actions = {
	addQuestion: async ({ cookies, params }) => {
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

		let max_pos = (await db.select({ max_position: max(questions.position) })
			.from(questions)
			.where(eq(questions.quizz_uuid, quizz.uuid))).at(0)?.max_position ?? 0;

		let uuid = crypto.randomUUID();

		await db.insert(questions)
			.values({
				uuid,
				quizz_uuid: quizz.uuid,
				position: max_pos + 1,
				question: 'Question #' + (max_pos + 1)
			});

		await db.update(quizzes)
			.set({
				updated_at: new Date()
			}).where(eq(quizzes.uuid, quizz.uuid));


		return redirect(302, '/dashboard/quizzes/edit/' + params.quizz_uuid + '/question/' + uuid);
	},
	deleteSession: async ({ request, cookies, params }) => {
		let user = await getCurrentUser(cookies);
		if (!user) {
			return fail(403);
		}

		let data = await request.formData();
		let session_uuid = data.get('session_uuid')?.toString();
		if (!session_uuid) {
			return fail(400, { session_uuid, missing: true });
		}

		let session = await getSessionByUUID(session_uuid);
		if (!session) {
			return fail(404);
		}

		let quizz = await getQuizzByShortUUID(session.quizz_uuid);
		if (!quizz) {
			return fail(404);
		}

		if (quizz.owner_uuid !== user.uuid) {
			return fail(403);
		}

		await db.delete(answers)
			.where(eq(answers.session_uuid, session_uuid));
		await db.delete(sessions)
			.where(eq(sessions.uuid, session_uuid));

		return { success: true };
	},
	update: async ({ request, cookies, params }) => {
		let user = await getCurrentUser(cookies);
		if (!user) {
			return fail(403);
		}

		let quizz = await getQuizzByShortUUID(params.quizz_uuid);
		if (!quizz) {
			return fail(404);
		}

		if (quizz.owner_uuid !== user.uuid) {
			return fail(403);
		}

		let formData = await request.formData();
		let stringified = formData.get('info');
		if (!stringified) {
			return fail(400);
		}

		/** @type {{public_since: string; public_until: string; answers_visible_since: string; duration: number; title: string}} */
		let parsed = JSON.parse(stringified.toString());

		try {
			/** @type {{public_since: Date; public_until: Date; answers_visible_since: Date; duration: number; title: string}} */
			let info = {
				title: parsed.title,
				public_since: new Date(parsed.public_since),
				public_until: new Date(parsed.public_until),
				answers_visible_since: new Date(parsed.answers_visible_since),
				duration: Number(parsed.duration)
			}

			if (!info.title) {
				return fail(400, { title_too_short: true });
			}

			if (info.title.length > 100) {
				return fail(400, { title_too_long: true });
			}

			if (info.duration < 2) {
				return fail(400, { duration_too_short: true })
			}

			await db.update(quizzes)
				.set(
					{
						title: info.title,
						duration_minutes: info.duration,
						public_since: info.public_since,
						public_until: info.public_until,
						answers_visible_since: info.answers_visible_since,
						updated_at: new Date()
					}
				);


			return { success: true };
		} catch {
			return fail(400);
		}
	}
}
