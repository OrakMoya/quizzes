import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { answers, question_parts, questions } from "./db/schema";

/**
 * @param {string} session_uuid
 */
export async function get_results(session_uuid) {
	let answers_rows = await db.select()
		.from(answers)
		.where(and(eq(answers.session_uuid, session_uuid)));
	let total = 0;
	let achieved = 0;
	/** @type {{question: (typeof questions.$inferInsert), parts: {part: (typeof question_parts.$inferInsert), answers: any[]}[]}[]} */
	let questions_in_quizz = [];
	answers_rows.forEach((answer) => {
		let question = answer.question_copy;
		let part = answer.question_part_copy;
		let answers = answer.answers;
		let q_idx = questions_in_quizz.findIndex(q => q.question.uuid === question.uuid);
		console.log(q_idx);
		if (q_idx === -1) {
			questions_in_quizz.push({
				question: question,
				parts: [{
					part: part,
					answers: answers
				}]
			})
		} else {
			questions_in_quizz[q_idx]
				.parts.push({
					part: part,
					answers: answers
				});
		}
		total += part.carries ?? 0;
		let number_of_answers = part.correct_data.length;
		answers.forEach((answer, idx) => {
			if (part.correct_data[idx] == answer) {
				achieved += (part.carries ?? 0) / number_of_answers;
			} else {
				achieved -= (part.wrong_carries ?? 0) / number_of_answers;
			}
		});
	})

	return {
		questions: questions_in_quizz,
		achieved,
		total
	};
}
