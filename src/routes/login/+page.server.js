import { fail, redirect } from '@sveltejs/kit';
import { attemptLogin, getCurrentUser } from '$lib/auth/auth';


/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	if (await getCurrentUser(cookies))
		return redirect(302, '/');
	return {};
}

/** @satisfies {import('../login/$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		let data = await request.formData();
		let exploded = {
			email: data.get('email'),
			password: data.get('password'),
			remember: data.get('remember_me'),
		};

		if (!exploded.email || !exploded.password) {
			return fail(403, { incorrect: true });
		}

		let token = "";

		try {
			token = await attemptLogin(
				{
					email: exploded.email.toString(),
					password: exploded.password.toString(),
					remember: exploded.remember?.toString() == 'on' ? true : false
				}
			);
		} catch {
			return fail(403, { incorrect: true });
		}

		cookies.set('token', token, { path: '/' });

		return { success: true, token: token };
	}
}
