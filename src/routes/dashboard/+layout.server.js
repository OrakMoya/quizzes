
/** @type {import('./dashboard/$types').LayoutServerLoad} */
export function load({ cookies }) {
	return {
		logged_in: cookies.get('token') ? true : false
	}
}
