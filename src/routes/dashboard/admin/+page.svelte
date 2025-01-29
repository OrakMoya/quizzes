<script>
	import { CrownIcon } from 'lucide-svelte';
	import RoleChanger from './RoleChanger.svelte';
	import UserActions from './UserActions.svelte';

	let { data } = $props();
	let users = $state(data.users);

	$effect(() => {
		users = data.users;
	});
</script>

<main class="max-w-screen-lg mx-auto">
	<div class="mb-4 grid grid-cols-1 gap-x-4 gap-y-2 text-center">
		<p class="content-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm">
			Role changes are effective immediately.
		</p>
	</div>
	<div>
		{#each users as user, i}
			<div class="grid grid-cols-3 items-center rounded-md px-4 py-2 odd:bg-neutral-950">
				<div class="flex items-center">
					{#if user.role == 'owner'}
						<CrownIcon class="mr-2 text-yellow-400" />
					{/if}
					{user.username}
				</div>
				<div class="col-span-2 md:col-span-1">
					{user.email}
				</div>
				<div class="flex items-center justify-end gap-x-4 col-span-3 md:col-span-1">
					{#if user.role !== 'owner'}
						<RoleChanger bind:user={users[i]} current={data.user?.uuid == user.uuid} />
					{:else}
						<span class="mr-4 text-neutral-400">App owner</span>
					{/if}
				<UserActions currentUserRole={data.user?.role} bind:user={users[i]} current={data.user?.uuid == user.uuid} />
				</div>
			</div>
		{/each}
	</div>
</main>
