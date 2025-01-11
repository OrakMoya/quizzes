import { db } from "$lib/server/db";
import { questions, quizzes } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { asc, eq, like } from "drizzle-orm";


/** @type {import("./$types").Actions} */
export let actions = {
	default: async ({ params }) => {
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

		let first_question = (await db.select()
			.from(questions)
			.where(eq(questions.quizz_uuid, quizz.uuid))
			.orderBy(asc(questions.position)))[0];

		return redirect(302, '/quizz/' + params.quizz_uuid + '/question/' + first_question.uuid);

	}

}
