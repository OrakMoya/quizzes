import { getCurrentUser } from "$lib/auth/auth";
import { users } from "../db/schema";

/**
 * @param {import("@sveltejs/kit").RequestEvent} request
 * @param {{pathStart: string, callbacks: (()=>boolean)[]}[]} guards
 */
export async function runGuards(request, guards) {
	// Presume user is authozired. Gets set to false if any guard fails.
	let authorized = true;

	guards = guards.filter((guard) => request.url.pathname.startsWith(guard.pathStart));

	authorized = !guards.find((guard) => {
		let authorizedInThisGuard = true;
		guard.callbacks.find((callback) => authorizedInThisGuard = authorizedInThisGuard && callback())
		return !authorizedInThisGuard;
	})

	return authorized;

}
