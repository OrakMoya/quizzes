import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { questions, quizzes } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq, max } from "drizzle-orm";

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

		return redirect(302, '/dashboard/quizzes/edit/' + params.quizz_uuid + '/question/' + uuid);
	}
}
