import { getCurrentUser } from "$lib/auth/auth";
import { error } from "@sveltejs/kit";

/** @type {import("../$types").PageServerLoad} */
export async function load({request, cookies}){
	let user = await getCurrentUser(cookies);
	if(!user){
		return error(403);
	}

}
