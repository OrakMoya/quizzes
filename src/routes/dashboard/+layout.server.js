import { getCurrentUser } from '$lib/auth/auth';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	return {
		user: await getCurrentUser(cookies, false)
	}
}
