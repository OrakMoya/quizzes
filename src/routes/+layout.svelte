<script>
	import '../app.css';
	let { children, data } = $props();
</script>

<div class="bg-neutral-900 w-full h-full min-w-screen min-h-screen">
	{@render children()}
</div>
