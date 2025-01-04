<script>
	import '../app.css';
	let { children } = $props();
</script>

<main class="bg-neutral-900 w-full h-full min-w-screen min-h-screen p-4 text-white">
	{@render children()}
</main>
