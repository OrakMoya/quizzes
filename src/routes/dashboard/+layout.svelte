<script>
	let { children, data } = $props();
</script>

<main class="min-w-screen h-full min-h-screen w-full bg-neutral-900 text-white">
	<header class=" w-full bg-black p-4">
		<div class="mx-auto flex max-w-screen-lg justify-between">
			<a href="/dashboard/quizzes">Quizzes</a>
			<nav class="flex gap-x-4">
				{#if data.logged_in}
					<a class="hover:font-bold" href="/logout" data-sveltekit-preload-data="off">Logout</a>
				{:else}
					<a class="hover:font-bold" href="/login">Login</a>
					<a class="hover:font-bold" href="/register">Register</a>
				{/if}
			</nav>
		</div>
	</header>
	<div>
		{@render children()}
	</div>
</main>
