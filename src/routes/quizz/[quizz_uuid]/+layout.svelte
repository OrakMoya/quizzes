<script>
	import UnderlinedLink from '../../dashboard/UnderlinedLink.svelte';

	let { children } = $props();
</script>

<header class="px-8 py-6 bg-black">
	<div class="mx-auto max-w-screen-lg">
		<UnderlinedLink href="/">Home</UnderlinedLink>
	</div>
</header>

<div class="min-w-screen h-screen min-h-screen w-screen px-8">
	<div class="mx-auto flex w-full max-w-screen-lg pt-32">
		{@render children()}
	</div>
</div>
