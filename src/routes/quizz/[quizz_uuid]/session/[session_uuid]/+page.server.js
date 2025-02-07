import { getCurrentUser } from "$lib/auth/auth";
import { getAnswersOfSessionByUUID, getQuizzByShortUUID, getSessionByUUID, getUserByUUID } from "$lib/server/utils";
import { error, redirect } from "@sveltejs/kit";


/** @type {import("./$types").PageServerLoad} */
export async function load({ params, cookies }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		return redirect(302, '/login');
	}
	let quizz = await getQuizzByShortUUID(params.quizz_uuid);
	if (!quizz) {
		return error(404, {message: 'Quizz not found.'});
	}

	let session = await getSessionByUUID(params.session_uuid)
	if (!session) {
		return error(404, {message: 'Session not found.'});
	}

	let answer_rows = (await getAnswersOfSessionByUUID(session.uuid))
		.sort((a, b) => a.question_copy.position - b.question_copy.position);
	if (answer_rows == null) {
		throw Error("Something went wrong");
	}

	let session_user = await getUserByUUID(session.user_uuid);

	if (session_user?.uuid !== user.uuid || Date.now() < quizz.answers_visible_since.getTime()) {
		return error(403, { message: 'Forbidden' });
	}


	return { answers: answer_rows, user: session_user };


}
