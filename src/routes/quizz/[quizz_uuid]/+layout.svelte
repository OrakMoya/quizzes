<script>
	let { children } = $props();
</script>

<div class="min-w-screen h-screen min-h-screen w-screen px-8">
	<div class="flex h-2/3 max-w-screen-lg mx-auto w-full flex-col justify-center">
		{@render children()}
	</div>
</div>
