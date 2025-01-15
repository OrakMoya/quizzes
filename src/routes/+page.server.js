import { db } from "$lib/server/db";
import { quizzes, sessions } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { like } from "drizzle-orm";



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
			.where(like(quizzes.uuid, quizz_uuid + "%"))
			.limit(1)).at(0);

		if (!quizz) {
			return fail(404, {quizz_uuid, incorrect: true});
		}

		return redirect(302, '/quizz/' + quizz_uuid);

	}
}
