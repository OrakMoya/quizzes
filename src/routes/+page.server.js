import { db } from "$lib/server/db";
import { question_parts, question_parts, questions, quizzes, sessions } from "$lib/server/db/schema";
import { getPartsOfQuestion } from "$lib/server/utils";
import { fail, redirect } from "@sveltejs/kit";
import { and, between, eq, gte, like, lte } from "drizzle-orm";



/** @type {import("./$types").Actions} */
export let actions = {
	take: async ({ request }) => {
		let data = await request.formData();
		let quizz_uuid = data.get('quizz_uuid')?.toString();
		if (!quizz_uuid || quizz_uuid.length !== 5) {
			return fail(400, { quizz_uuid: quizz_uuid, missing: true });
		}

		let quizz = (await db.select()
			.from(quizzes)
			.where(
				and(
					like(quizzes.uuid, quizz_uuid + "%"),
					lte(quizzes.public_since, new Date()),
					gte(quizzes.public_until, new Date())
				)
			)
			.limit(1)).at(0);

		if (!quizz) {
			return fail(404, { quizz_uuid, incorrect: true });
		}

		let question_parts_rows = await db.select()
			.from(questions)
			.innerJoin(question_parts, eq(questions.uuid, question_parts.question_uuid))
			.where(eq(questions.quizz_uuid, quizz.uuid))

		if (!question_parts_rows.length) {
			return fail(404, { quizz_uuid, incorrect: true });
		}


		return redirect(302, '/quizz/' + quizz_uuid);

	}
}
