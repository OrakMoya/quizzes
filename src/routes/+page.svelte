<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ArrowRightIcon } from 'lucide-svelte';

	/** @typedef {Object} Props
	 * @prop {{logged_in: boolean}} data
	 */

	/** @type {Props} */
	let { data } = $props();

</script>

<main class="min-w-screen h-screen min-h-screen w-screen overflow-clip bg-neutral-900 text-white">
	<div class="flex h-full w-full flex-col items-center justify-center">
		gas
		{#if data.logged_in}
			<form class="flex" action="?/take" method="post" use:enhance>
				<Input name="quizz_uuid"></Input>
				<Button type="submit"><ArrowRightIcon /></Button>
			</form>
			<a href="/dashboard">Dashboard</a>
		{:else}
			<a href="/login">Log in</a>
			<a href="/register">Register</a>
		{/if}
	</div>
</main>
