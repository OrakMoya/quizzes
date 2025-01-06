import { getCurrentUser, logout } from "$lib/auth/auth";
import { runGuards } from "$lib/server/auth/guard";
import { fail, redirect } from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	let user = null;

	try {
		user = await getCurrentUser(event.cookies);
	} catch {
		logout(event.cookies);
	}

	let isAuthorized = true;

	if (!isAuthorized) {
		if (!user)
			return redirect(302, '/login');
		else return new Response("Forbidden", { status: 403 });
	}

	if (event.url.pathname.startsWith('/logout')) {
		logout(event.cookies);
		return redirect(302, '/');
	}

	return await resolve(event);
}
