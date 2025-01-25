<script>
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { SaveIcon } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let user = $state(data.user);
	let results = $state(data.results);

	let newPassword = $state('');
	let newPasswordConfirmation = $state('');

	$effect(() => {
		console.log(data);
		data;
		setTimeout(() => {
			user = data.user;
			results = data.results;
		});
	});
</script>

<main class="mx-auto max-w-screen-lg pt-4">
	<div class="float-left mr-6 rounded-md border border-neutral-800 bg-neutral-950 p-4">
		<h1 class="mb-2 text-2xl font-bold">Profile</h1>
		<form class="group w-[400px]" method="post" use:enhance action="?/updateProfile">
			<Label>Username</Label>
			<Input required type="text" bind:value={user.username} name="new_username" />
			<Label>E-mail</Label>
			<Input type="email" disabled value={user.email} />
			<Accordion.Root type="single" class="">
				<Accordion.Item value="item-1" class="border-0">
					<Accordion.Trigger>Password</Accordion.Trigger>
					<Accordion.Content class="">
						<Label>Old password</Label>
						<Input
							required={newPasswordConfirmation || newPassword ? true : false}
							type="password"
							autocomplete="new-password"
							name="old_password"
						/>
						<Label>New password</Label>
						<Input
							required={newPasswordConfirmation ? true : false}
							type="password"
							autocomplete="new-password"
							bind:value={newPassword}
							name="new_password"
						/>
						<Label>Confirm new password</Label>
						<Input
							required={newPassword ? true : false}
							type="password"
							autocomplete="new-password"
							bind:value={newPasswordConfirmation}
							name="new_password_confirmation"
						/>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
			<Button
				type="submit"
				data-invalid={newPassword !== newPasswordConfirmation}
				class="group-invalid:pointer-events-none group-invalid:opacity-50 data-[invalid=true]:pointer-events-none data-[invalid=true]:opacity-50"
				><SaveIcon /></Button
			>
		</form>
	</div>
	<h2 class="mb-2 text-2xl font-bold">Sessions</h2>
	<div class="w-auto">
		<div class="">
			{#each results as result}
				<div class="mb-1 grid grid-cols-3 place-items-center text-lg justify-between rounded-md px-2 py-1 odd:bg-neutral-800">
					<div class="font-bold">{result.quizz.title}</div>
					<div class="flex items-center">
						<div>{result.results.achieved}</div>
						<div class="text-4xl mx-2 font-light ">/</div>
						<div>{result.results.total}</div>
					</div>
					<div>
						{Math.floor((result.results.achieved / result.results.total) * 100 * 100) / 100}%
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
