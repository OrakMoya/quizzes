import { isNotNull, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

const timestamps = {
	created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
	updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
};

const uuids = {
	uuid: text('uuid', { mode: 'text' }).primaryKey(),
}

export const users = sqliteTable('users', {
	...uuids,
	first_name: text('first_name', { mode: 'text' }),
	last_name: text('last_name', { mode: 'text' }),
	username: text('username', { mode: 'text' }).notNull(),
	email: text('email', { mode: 'text' }).notNull(),
	password: text('password', { mode: 'text' }).notNull(),
	role: text('role', { enum: ['owner','admin', 'user', 'guest'] }).notNull(),
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
	public_since: integer('public_since', { mode: 'timestamp' })
		.default(new Date(0))
		.notNull(),
	public_until: integer('public_until', { mode: 'timestamp' })
		.default(new Date(8640000000000000))
		.notNull(),
	answers_hidden: integer('answers_hidden')
		.default(1)
		.notNull(),
	answers_visible_since: integer('answers_visible_since', { mode: 'timestamp' })
		.default(new Date(8640000000000000))
		.notNull(),
	duration_minutes: integer('duration_minutes')
		.default(30)
		.notNull(),
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
	duration_minutes: integer('duration_minutes').notNull(),
	user_uuid: text('user_uuid', { mode: 'text' })
		.references(() => users.uuid, { onDelete: 'set null' })
		.notNull(),
	quizz_uuid: text('quizz_uuid', { mode: 'text' })
		.references(() => quizzes.uuid, { onDelete: 'cascade' })
		.notNull(),
	in_progress: integer('in_progress')
		.default(0)
		.notNull(),
	published: integer('published')
		.default(0)
		.notNull(),
	...timestamps
})

export const answers = sqliteTable('answers', {
	...uuids,
	question_uuid: text('question_uuid', { mode: 'text' })
		.notNull(),
	question_part_uuid: text('question_part_uuid', { mode: 'text' })
		.notNull(),
	user_uuid: text('user_uuid', { mode: 'text' })
		.references(() => users.uuid, { onDelete: 'cascade' })
		.notNull(),
	question_copy: text('question_copy', { mode: 'json' })
		.$type<typeof questions.$inferInsert>()
		.notNull(),
	question_part_copy: text('question_part_copy', { mode: 'json' })
		.$type<typeof question_parts.$inferInsert>()
		.notNull(),
	answers: text('answers', { mode: 'json' }).$type<any>(),
	session_uuid: text('session_uuid', { mode: 'text' })
		.references(() => sessions.uuid, { onDelete: 'cascade' })
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
