<script>
	/** @typedef {Object} Props
	 * @prop {{logged_in: boolean}} data
	 */

	/** @type {Props} */
	let { data } = $props();

	console.log(data);
</script>

<main class="min-w-screen h-screen min-h-screen w-screen overflow-clip bg-neutral-900 text-white">
	<div class="flex h-full w-full flex-col items-center justify-center">
		gas
		{#if data.logged_in}
			<a href="/dashboard">Dashboard</a>
		{:else}
			<a href="/login">Log in</a>
			<a href="/register">Register</a>
		{/if}
	</div>
</main>
