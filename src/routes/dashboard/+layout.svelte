<script>
	import { ExternalLinkIcon } from 'lucide-svelte';
	import UnderlinedLink from './UnderlinedLink.svelte';

	let { children, data } = $props();
</script>

<main class="min-w-screen h-full min-h-screen w-full bg-neutral-900 text-white">
	<header class=" w-full bg-neutral-950 px-8 py-6">
		<div
			class="mx-auto flex max-w-screen-lg flex-col-reverse justify-between gap-x-4 gap-y-2 sm:flex-row"
		>
			<div class="flex flex-col-reverse items-center gap-x-8 gap-y-2 sm:flex-row">
				<UnderlinedLink href="/"
					><span class="flex items-center gap-x-2">Home <ExternalLinkIcon class="size-5" /></span>
				</UnderlinedLink>
				<UnderlinedLink href="/dashboard">Dashboard</UnderlinedLink>
				<UnderlinedLink href="/dashboard/quizzes">Quizzes</UnderlinedLink>
				<UnderlinedLink href="/dashboard/profile">Profile</UnderlinedLink>
				{#if data.user?.role == 'admin' || data.user?.role == 'owner'}
					<UnderlinedLink href="/dashboard/admin">Admin</UnderlinedLink>
				{/if}
			</div>
			<nav class="flex flex-col-reverse items-center gap-x-4 gap-y-2 sm:flex-row">
				{#if data.user}
					<UnderlinedLink href="/logout" rel="external" preload="off">Log out</UnderlinedLink>
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
