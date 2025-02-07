import { db } from "$lib/server/db";
import { quizzes } from "$lib/server/db/schema";
import { error, fail } from "@sveltejs/kit";
import { like } from "drizzle-orm";


/** @type {import("./$types").LayoutServerLoad} */
export async function load({ params }) {
	let quizz_uuid = params.quizz_uuid;
	if (!quizz_uuid || quizz_uuid.length !== 5) {
		return error(404, {message: 'Quizz not found.'});
	}

	let quizz = (await db.select()
		.from(quizzes)
		.where(like(quizzes.uuid, quizz_uuid + "%"))
		.limit(1)).at(0);

	if (!quizz) {
		return error(404, {message: 'Quizz not found.'});
	}

	return { quizz };
}
