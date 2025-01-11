import { getCurrentUser } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { question_parts, questions } from "$lib/server/db/schema";
import { error, fail, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";


/** @type {import("./$types").PageServerLoad} */
export async function load({ cookies, params }) {
	let user = await getCurrentUser(cookies);
	if (!user) {
		return error(403);
	}
	let question = (await db.select()
		.from(questions)
		.where(eq(questions.uuid, params.question_uuid))
		.limit(1)).at(0);
	if (!question) {
		return error(404);
	}
	let question_part_rows = await db.select()
		.from(question_parts)
		.where(eq(question_parts.question_uuid, question.uuid));

	return { question, current_question_parts: question_part_rows }
}

/** @type {import("./$types").Actions} */
export const actions = {
	createQuestionPart: async () => {
		return {};
	},
	save: async ({ cookies, params, request }) => {
		let user = await getCurrentUser(cookies);
		if (!user) {
			return error(403);
		}
		let current_question = (await db.select()
			.from(questions)
			.where(eq(questions.uuid, params.question_uuid))
			.limit(1)).at(0);
		if (!current_question) {
			return error(404);
		}

		let data = await request.formData();
		let questionText = data.get('question');
		/** @type {{text: string; type: typeof question_parts.$inferInsert.type; data: any[], carries: Number, wrong_carries: Number}[]} */
		let questionParts = JSON.parse(data.get('question_parts')?.toString() ?? "[]");
		if (!questionText) {
			return fail(400, { questionText, missing: true });
		}


		await db.update(questions)
			.set({ question: questionText.toString() })
			.where(eq(questions.uuid, current_question.uuid));
		await db.delete(question_parts)
			.where(eq(question_parts.question_uuid, current_question.uuid));

		questionParts.forEach(async (part) => {
			await db.insert(question_parts)
				.values({
					uuid: crypto.randomUUID(),
					text: part.text,
					type: part.type,
					carries: part.carries,
					wrong_carries: part.wrong_carries,
					question_uuid: current_question.uuid,
					question_data: part.question_data,
					correct_data: part.correct_data
				});
		});

		return { success: true };
	}
}
