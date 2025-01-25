import { and, desc, eq, like } from "drizzle-orm";
import { db } from "./db";
import { answers, question_parts, questions, quizzes, sessions, users } from "./db/schema";

/**
 * @param {string} session_uuid
 */
export async function getResults(session_uuid) {
	let answers_rows = await db.select()
		.from(answers)
		.where(and(eq(answers.session_uuid, session_uuid)));
	if (!answers_rows)
		return null;
	let total = 0;
	let achieved = 0;
	/** @type {{question: (typeof questions.$inferInsert), parts: {part: (typeof question_parts.$inferInsert), answers: any[]}[]}[]} */
	let questions_in_quizz = [];
	answers_rows.forEach((answer) => {
		let question = answer.question_copy;
		let part = answer.question_part_copy;
		let answers = answer.answers;
		let q_idx = questions_in_quizz.findIndex(q => q.question.uuid === question.uuid);
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
		if (answers.forEach) {
			answers.forEach((/** @type {any} */ answer, /** @type {number} */ idx) => {
				if (part.correct_data[idx] == answer) {
					achieved += (part.carries ?? 0) / number_of_answers;
				} else {
					achieved -= (part.wrong_carries ?? 0) / number_of_answers;
				}
			});
		} else {
			if (part.correct_data == answers) {
				achieved += part.carries ?? 0;
			} else {
				achieved -= part.wrong_carries ?? 0;
			}
		}
	});

	return {
		questions: questions_in_quizz,
		achieved: achieved >= 0 ? achieved : 0, // Svaka cast ono
		total
	};
}


/**
 * @param {string} uuid
 */
export async function getSessionsOfQuizz(uuid) {

	if (uuid) {
		let session_rows = await db.select()
			.from(sessions)
			.where(eq(sessions.quizz_uuid, uuid))
			.orderBy(desc(sessions.updated_at));
		return session_rows;
	}
	return null;
}

/**
 * @param {string} uuid
 */
export async function getFinishedSessionsOfQuizz(uuid) {

	if (uuid) {
		let session_rows = await db.select()
			.from(sessions)
			.where(and(eq(sessions.quizz_uuid, uuid), eq(sessions.in_progress, 0)))
			.orderBy(desc(sessions.updated_at));
		return session_rows;
	}
	return null;
}

/**
 * @param {string} short_uuid
 */
export async function getQuizzByShortUUID(short_uuid) {
	return (await db.select()
		.from(quizzes)
		.where(
			like(quizzes.uuid, short_uuid + '%')
		).limit(1)).at(0)
}

/**
 * @param {string} message
 * @returns {never}
 */
export function throwExpression(message){
	throw message;
}


/**
 * @param {string} uuid
 */
export async function getUserByUUID(uuid) {
	return (
		await db.select()
			.from(users)
			.where(eq(users.uuid, uuid))
			.limit(1)
	).at(0);
}


/**
 * @param {string} uuid
 */
export async function getQuestion(uuid) {

	return (await db.select()
		.from(questions)
		.where(eq(questions.uuid, uuid))
		.limit(1)).at(0)
}


/**
 * @param {string} uuid
 */
export async function getPartsOfQuestion(uuid) {
	return await db.select()
		.from(question_parts)
		.where(eq(question_parts.question_uuid, uuid));
}

/**
 * @param {string} uuid
 */
export async function getSessionByUUID(uuid) {
	return (await db.select()
		.from(sessions)
		.where(eq(sessions.uuid, uuid))).at(0);
}


/**
 * @param {string} uuid
 */
export async function getAnswersOfSessionByUUID(uuid) {
	return await db.select().from(answers)
		.where(eq(answers.session_uuid, uuid));
}

