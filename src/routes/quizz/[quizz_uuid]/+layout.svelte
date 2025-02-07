<script>
	import UnderlinedLink from '../../dashboard/UnderlinedLink.svelte';
	import { page } from '$app/state';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>{data.quizz?.title} - Quizzes</title>
</svelte:head>

<header class="bg-black px-8 py-6">
	<div class="mx-auto flex max-w-screen-lg items-center gap-x-8">
		<UnderlinedLink href="/">Quizzes</UnderlinedLink>
		<UnderlinedLink class="uppercase" href="/quizz/{page.params.quizz_uuid}">
			{page.params.quizz_uuid}
		</UnderlinedLink>
	</div>
</header>

<div class="min-w-screen w-screen px-8">
	<div class="mx-auto flex w-full max-w-screen-lg">
		{@render children()}
	</div>
</div>
