<script>
	import { ExternalLinkIcon } from 'lucide-svelte';
	import UnderlinedLink from './UnderlinedLink.svelte';

	let { children, data } = $props();
</script>

<main class="min-w-screen h-full min-h-screen w-full bg-neutral-900 text-white">
	<header class=" w-full bg-black px-8 py-6">
		<div class="mx-auto flex max-w-screen-lg justify-between flex-col-reverse sm:flex-row gap-x-4 gap-y-2">
			<div class="flex flex-col-reverse sm:flex-row items-center gap-x-8 gap-y-2">
				<UnderlinedLink href="/"
					><span class="flex gap-x-2 items-center">Home <ExternalLinkIcon class="size-5" /></span>
				</UnderlinedLink>
				<UnderlinedLink href="/dashboard">Dashboard</UnderlinedLink>
				<UnderlinedLink href="/dashboard/quizzes">Quizzes</UnderlinedLink>
				<UnderlinedLink href="/dashboard/profile">Profile</UnderlinedLink>
			</div>
			<nav class="flex flex-col-reverse sm:flex-row items-center gap-x-4 gap-y-2">
				{#if data.logged_in}
					<UnderlinedLink href="/logout" preload="off">Log out</UnderlinedLink>
				{:else}
					<a class="hover:font-bold" href="/login">Login</a>
					<a class="hover:font-bold" href="/register">Register</a>
				{/if}
			</nav>
		</div>
	</header>
	<div class="p-4">
		{@render children()}
	</div>
</main>
