import { getCurrentUser } from '$lib/auth/auth';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	return {
		logged_in: await getCurrentUser(cookies) ? true : false,
		user: await getCurrentUser(cookies)
	}
}
