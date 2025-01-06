import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

const timestamps = {
	created_at: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
};

const uuids = {
	uuid: text('uuid', { mode: 'text' }).primaryKey(),
}

export const users = sqliteTable('users', {
	...uuids,
	username: text('username', { mode: 'text' }).notNull(),
	email: text('email', { mode: 'text' }).notNull(),
	password: text('password', { mode: 'text' }).notNull(),
	role: text('role', { enum: ['admin', 'user'] }).notNull(),
	...timestamps
});

export const groups = sqliteTable('groups', {
	...uuids,
	name: text('name', { mode: 'text' }).unique().notNull(),
	...timestamps
});

export const quiz_collaborators = sqliteTable('quiz_collaborators', {
	...uuids,
	collaborator_uuid: text('collaborator_id', { mode: 'text' })
		.references(() => users.uuid, { onDelete: 'cascade' })
		.notNull(),
	...timestamps
});


export const quizzes = sqliteTable('quizzes', {
	...uuids,
	owner_uuid: text('user_uuid', { mode: 'text' })
		.references(() => users.uuid, { onDelete: 'cascade' })
		.notNull(),
	group_uuid: text('group_uuid', { mode: 'text' })
		.references(() => groups.uuid, { onDelete: 'set null' }),
	...timestamps
})

export const questions = sqliteTable('questions', {
	...uuids,
	quizz_uuid: text('quizz_uuid', { mode: 'text' })
		.references(() => quizzes.uuid, { onDelete: 'cascade' })
		.notNull(),
	question: text('question', { mode: 'text' })
		.notNull(),
	...timestamps
});

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
	}),
	data: text('data', { mode: 'json' }),
	carries: real('carries'),
	wrong_carries: real('wrong_carries'),
	question_uuid: text('question_uuid')
		.references(() => questions.uuid, { onDelete: 'cascade' })
		.notNull()
})
