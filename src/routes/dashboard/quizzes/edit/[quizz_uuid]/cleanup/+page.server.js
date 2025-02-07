import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { question_parts, questions } from "$lib/server/db/schema";
import { getQuizzByShortUUID, getUserByUUID } from "$lib/server/utils";
import { error, redirect } from "@sveltejs/kit";
import { asc, eq, notInArray } from "drizzle-orm";


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

	if (quizz.owner_uuid !== user.uuid) {
		return error(403);
	}

	await db.delete(questions)
		.where(
			notInArray(
				questions.uuid,
				(await db.select({ question_uuid: question_parts.question_uuid })
					.from(question_parts))
					.map(v => v.question_uuid)
			)
		);
	let question_rows = await db.select()
		.from(questions)
		.where(eq(questions.quizz_uuid, quizz.uuid))
		.orderBy(asc(questions.position));

	await Promise.all(
		question_rows.map(
			async (q, i) => {
				await db.update(questions)
					.set({ position: i + 1 })
					.where(eq(questions.uuid, q.uuid))
			}
		));

	throw redirect(302, '/dashboard/quizzes/edit/' + params.quizz_uuid);


}
