import { getCurrentUser } from "$lib/auth/auth";
import { getAnswersOfSessionByUUID, getQuizzByShortUUID, getSessionByUUID, getUserByUUID } from "$lib/server/utils";
import { error } from "@sveltejs/kit";


/** @type {import("./$types").PageServerLoad} */
export async function load({ params, cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		error(403);
	}
	let quizz = await getQuizzByShortUUID(params.quizz_uuid);
	if (!quizz) {
		error(404);
	}

	let session = await getSessionByUUID(params.session_uuid)
	if (!session) {
		error(404);
	}

	let answer_rows = (await getAnswersOfSessionByUUID(session.uuid))
		.sort((a, b) => a.question_copy.position - b.question_copy.position);
	if (answer_rows == null) {
		throw Error("Something went wrong");
	}

	let session_user = await getUserByUUID(session.user_uuid);


	return { answers: answer_rows, user: session_user };


}
