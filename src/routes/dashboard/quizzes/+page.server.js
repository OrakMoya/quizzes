import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { quizzes, users } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";


/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) return redirect(302, '/login');

	let quizzes_data = await db.select()
		.from(quizzes)
		.where(eq(quizzes.owner_uuid, user.uuid));

	return { quizzes: quizzes_data };
}


/** @satisfies {import("./$types").Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		let formData = await request.formData();
		let newQuizName = formData.get('name');
		let user = await getCurrentUser(cookies);


		if (!user) {
			return fail(403);
		}

		if (!newQuizName) {
			return fail(400, { newQuizName, missing: true });
		}
		let uuid = crypto.randomUUID();

		await db.insert(quizzes)
			.values({
				uuid,
				title: newQuizName.toString(),
				owner_uuid: user.uuid
			});

		return redirect(302, "quizzes/edit/" + uuid);
	}
}
