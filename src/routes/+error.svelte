<script>
	import { page } from '$app/state';
	import { ArrowRightIcon, MoveRightIcon } from 'lucide-svelte';
</script>

<main class="px-16 py-8">
	<div class="mx-auto mt-16 max-w-screen-sm">
		<p class="text-lg tracking-tight text-neutral-500">Uh oh. Something went wrong.</p>
		<p class="mb-6 text-lg tracking-tight text-neutral-500">
			The server returned the following error:
		</p>
		<h1 class="mb-2 text-8xl font-bold">{page.status}</h1>
		<p class="mb-12 text-2xl font-bold text-neutral-500">{page.error?.message}</p>
		<a class="text-lg text-neutral-500 hover:text-foreground transition-all group flex items-center gap-x-2" href="/">Go back home<MoveRightIcon class="relative group-hover:translate-x-2 -translate-x-8 scale-[25%] group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100 top-[1px]" /> </a>
	</div>
</main>
