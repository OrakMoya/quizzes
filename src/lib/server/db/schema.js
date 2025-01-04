import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, SQLiteTimestamp, unique } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	uuid: text('uuid', {mode:'text'}).primaryKey(),
	username: text('username', {mode: 'text'}),
	email: text('email', {mode: 'text'}),
	password: text('password', {mode: 'text'}),
	created_at: integer('created_at', {mode: 'timestamp'}).default(sql`CURRENT_TIMESTAMP`),
	updated_at: integer('updated_at', {mode: 'timestamp'}).default(sql`CURRENT_TIMESTAMP`),
});
