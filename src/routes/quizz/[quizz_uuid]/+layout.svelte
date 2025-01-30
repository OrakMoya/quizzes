<script>
	import UnderlinedLink from '../../dashboard/UnderlinedLink.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>{data.quizz?.title} - Quizzes</title>
</svelte:head>

<header class="bg-black px-8 py-6">
	<div class="mx-auto max-w-screen-lg">
		<UnderlinedLink href="/">Quizzes</UnderlinedLink>
	</div>
</header>

<div class="min-w-screen h-screen min-h-screen w-screen px-8">
	<div class="mx-auto flex w-full max-w-screen-lg pt-32">
		{@render children()}
	</div>
</div>
