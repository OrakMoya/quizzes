import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/mysql-core';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

const timestamps = {
	created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
};

const uuids = {
	uuid: text('uuid', { mode: 'text' }).primaryKey(),
}

export const users = sqliteTable('users', {
	...uuids,
	first_name: text('first_name', {mode: 'text'}),
	last_name: text('last_name', {mode: 'text'}),
	username: text('username', { mode: 'text' }).notNull(),
	email: text('email', { mode: 'text' }).notNull(),
	password: text('password', { mode: 'text' }).notNull(),
	role: text('role', { enum: ['admin', 'user', 'guest'] }).notNull(),
	...timestamps
});

export const groups = sqliteTable('groups', {
	...uuids,
	name: text('name', { mode: 'text' }).unique().notNull(),
	...timestamps
});

export const quizz_collaborators = sqliteTable('quiz_collaborators', {
	...uuids,
	collaborator_uuid: text('collaborator_id', { mode: 'text' })
		.references(() => users.uuid, { onDelete: 'cascade' })
		.notNull(),
	...timestamps
});


export const quizzes = sqliteTable('quizzes', {
	...uuids,
	title: text('title', { mode: 'text' }).notNull(),
	owner_uuid: text('user_uuid', { mode: 'text' })
		.references(() => users.uuid, { onDelete: 'cascade' })
		.notNull(),
	group_uuid: text('group_uuid', { mode: 'text' })
		.references(() => groups.uuid, { onDelete: 'set null' }),
	version: integer('version').default(1),
	...timestamps
})

export const questions = sqliteTable('questions', {
	...uuids,
	position: integer('position').notNull(),
	quizz_uuid: text('quizz_uuid', { mode: 'text' })
		.references(() => quizzes.uuid, { onDelete: 'cascade' })
		.notNull(),
	question: text('question', { mode: 'text' })
		.notNull(),
	...timestamps
});

export const sessions = sqliteTable('sessions', {
	...uuids,
	user_uuid: text('user_uuid', { mode: 'text' })
		.references(() => users.uuid)
		.notNull(),
	quizz_uuid: text('quizz_uuid', { mode: 'text' })
		.references(() => quizzes.uuid)
		.notNull(),
	in_progress: integer('in_progress').default(0),
	...timestamps
})

export const answers = sqliteTable('answers', {
	...uuids,
	question_uuid: text('question_uuid', { mode: 'text' })
		.notNull(),
	question_part_uuid: text('question_part_uuid', { mode: 'text' })
		.notNull(),
	user_uuid: text('user_uuid', { mode: 'text' })
		.references(() => users.uuid)
		.notNull(),
	question_copy: text('question_copy', { mode: 'json' })
		.$type<typeof questions.$inferInsert>()
		.notNull(),
	question_part_copy: text('question_part_copy', {mode:'json'})
		.$type<typeof question_parts.$inferInsert>()
		.notNull(),
	answers: text('answers', { mode: 'json' }).$type<any>(),
	session_uuid: text('session_uuid', { mode: 'text' })
		.references(() => sessions.uuid)
		.notNull(),
	...timestamps
})

export const question_parts = sqliteTable('question_parts', {
	...uuids,
	type: text('type', {
		enum: [
			'text',
			'textarea',
			'checkbox',
			'number',
			'radio'
		]
	}).notNull(),
	question_data: text('question_data', { mode: 'json' }).$type<any[]>().notNull(),
	correct_data: text('correct_data', { mode: 'json' }).$type<any[]>().notNull(),
	text: text('text', { mode: 'text' }).default('').notNull(),
	carries: real('carries').default(1).notNull(),
	wrong_carries: real('wrong_carries').default(0.25).notNull(),
	question_uuid: text('question_uuid')
		.references(() => questions.uuid, { onDelete: 'cascade' })
		.notNull(),
	...timestamps
})
