import { fail, redirect } from '@sveltejs/kit';
import { attemptLogin, getCurrentUser } from '$lib/auth/auth';


/** @type {import('./$types').PageServerLoad} */
export async function load({cookies}){
	if(await getCurrentUser(cookies))
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
		};
		if (!exploded.email || !exploded.password) {
			return fail(403, { message: 'Invalid username or password' });
		}

		let token = "";

		try {
			token = await attemptLogin({ email: exploded.email.toString(), password: exploded.password.toString() })
		} catch {
			return fail(403, { message: 'Invalid username or password' });
		}

		cookies.set('token', token, { path: '/' });

		return { success: true, token: token };
	}
}
