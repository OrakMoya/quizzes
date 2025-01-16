import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { questions, quizzes, sessions, users } from "$lib/server/db/schema";
import { getQuizzByShortUUID, getUserByUUID } from "$lib/server/utils";
import { fail, redirect } from "@sveltejs/kit";
import { eq, param } from "drizzle-orm";
import { MySqlTimestampString } from "drizzle-orm/mysql-core";


/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) return redirect(302, '/login');

	let quizzes_rows = await db.select()
		.from(quizzes)
		.where(eq(quizzes.owner_uuid, user.uuid));

	let quizzes_data = await Promise.all(quizzes_rows.map(
		async quizz => ({ ...quizz, owner_username: (await getUserByUUID(quizz.owner_uuid))?.username ?? '[deleted]' })
	));

	return { quizzes: quizzes_data };
}


/** @satisfies {import("./$types").Actions} */
export const actions = {
	createQuizz: async ({ request, cookies }) => {
		let formData = await request.formData();
		let newQuizzName = formData.get('name');
		let user = await getCurrentUser(cookies);


		if (!user) {
			return fail(403);
		}

		if (!newQuizzName) {
			return fail(400, { newQuizName: newQuizzName, missing: true });
		}
		let uuid = crypto.randomUUID();

		await db.insert(quizzes)
			.values({
				uuid,
				title: newQuizzName.toString(),
				owner_uuid: user.uuid
			});

		return redirect(302, "quizzes/edit/" + uuid);
	},
	deleteQuizz: async ({ request, cookies, params }) => {
		let user = await getCurrentUser(cookies);
		if(!user){
			return fail(403);
		}

		let formData = await request.formData();

		let quizzUuid = formData.get('quizz_uuid');
		if(!quizzUuid){
			return fail(400, {quizz_uuid: quizzUuid, missing: true});
		}

		let quizz = await getQuizzByShortUUID(quizzUuid.toString());
		if(!quizz){
			return fail(404);
		}

		if(quizz.owner_uuid !== user.uuid){
			return fail(403);
		}

		await db.delete(quizzes)
			.where(eq(quizzes.uuid, quizz.uuid));



		return { success: true }
	}
}
