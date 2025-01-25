import { getCurrentUser } from "$lib/auth/auth";
import { error, fail } from "@sveltejs/kit";
import { date } from "drizzle-orm/mysql-core";
import bcrypt from "bcrypt";
import { db } from "$lib/server/db";
import { quizzes, sessions, users } from "$lib/server/db/schema";
import { and, desc, eq, gt, lte, ne, or } from "drizzle-orm";
import { getQuizzByShortUUID, getResults, throwExpression } from "$lib/server/utils";

/** @type {import("../$types").PageServerLoad} */
export async function load({ cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		return error(403);
	}

	let userData = { ...user, password: "" };

	let past_sessions = (await db.select()
		.from(sessions)
		.innerJoin(quizzes, eq(sessions.quizz_uuid, quizzes.uuid))
		.where(
			and(
				eq(sessions.user_uuid, user.uuid),
				eq(sessions.in_progress, 0),
				or(
					eq(quizzes.answers_hidden, 0),
					lte(quizzes.answers_visible_since, new Date()),
					eq(sessions.published, 1),
				)
			)
		).orderBy(desc(sessions.updated_at))).map(r => r.sessions);

	let past_results = (
		await Promise.all(
			past_sessions.map(
				async session => (
					{
						quizz: await getQuizzByShortUUID(session.quizz_uuid) ?? throwExpression("Error getting quizz"),
						results: await getResults(session.uuid) ?? throwExpression("Error fetching results")
					}
				)
			)
		)
	).filter(result => result.results !== null)
		.map(result => ({
			quizz: {
				uuid: result.quizz.uuid,
				title: result.quizz?.title
			},
			results: {
				achieved: result.results?.achieved,
				total: result.results?.total
			}
		}))?? [];

	return { user: userData, results: past_results };
}

/**@type {import("./$types").Actions} */
export let actions = {
	updateProfile: async ({ request, cookies }) => {
		let user = await getCurrentUser(cookies);
		if (!user) {
			return error(403);
		}

		let data = await request.formData();
		let username = data.get("new_username")?.toString();
		let oldPassword = data.get("old_password")?.toString();
		let newPassword = data.get("new_password")?.toString();
		let newPasswordConfirmation = data.get("new_password_confirmation")?.toString();

		if (!username) {
			return fail(400, { username, username_missing: true });
		}

		let newUsernameAlreadyExists = (await
			db.select()
				.from(users)
				.where(
					and(eq(users.username, username), ne(users.uuid, user.uuid)))).length;
		if (newUsernameAlreadyExists) {
			return fail(400, { username, username_taken: true });
		}

		if (
			oldPassword ||
			newPassword ||
			newPasswordConfirmation
		) {
			if (!oldPassword) {
				return fail(400, { oldPassword, old_password_missing: true })
			}
			if (!newPassword) {
				return fail(400, { newPassword, new_password_missing: true })
			}
			if (!newPasswordConfirmation) {
				return fail(400, { newPassword, new_password_confirmation_missing: true })
			}

			if (!(await bcrypt.compare(oldPassword, user.password))) {
				return fail(403, { incorrect_password: true });
			}
			if (newPassword !== newPasswordConfirmation) {
				return fail(400, { new_password_mismatch: true });
			}

			let salt = await bcrypt.genSalt(10);
			let newPasswordHash = await bcrypt.hash(newPassword, salt);

			await db.update(users)
				.set({
					username,
					password: newPasswordHash
				});

			return { success: true };
		}

		await db.update(users)
			.set({
				username
			});

		return { success: true };

	}

}
