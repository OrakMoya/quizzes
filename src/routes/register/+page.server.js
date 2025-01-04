
/** @satisfies {import('../login/$types').Actions} */
export const actions = {
	default: async ({ request })=>{
		/** @type {{name: string; email: string; password: string}} */
		let data = await request.formData();
		return { success: true };
	}
}
