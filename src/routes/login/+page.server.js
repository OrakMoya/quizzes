
/** @satisfies {import('../login/$types').Actions} */
export const actions = {
	register: async ({ request })=>{
		console.log("gas");
		console.log(await request.formData());
		return { success: true };
	}
}
