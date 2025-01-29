<script>
	import UnderlinedLink from '../dashboard/UnderlinedLink.svelte';

	let { children } = $props();
</script>

<header class="bg-neutral-950 px-8 py-6">
	<div class="mx-auto max-w-screen-lg">
		<UnderlinedLink href="/">Quizzes</UnderlinedLink>
	</div>
</header>

{@render children()}
