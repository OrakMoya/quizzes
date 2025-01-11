<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { PlusIcon } from 'lucide-svelte';

	let { data } = $props();

	let new_quizz_dialog_open = $state(false);
</script>

<div class="">
	{#each data.quizzes as quizz}
		<a class="block" href={'quizzes/edit/' + quizz.uuid}>{quizz.title}</a>
	{/each}
</div>

<Dialog.Root bind:open={new_quizz_dialog_open}>
	<Dialog.Trigger>
		<PlusIcon />
	</Dialog.Trigger>
	<Dialog.Content>
		<form class="flex flex-col gap-y-4" method="post" use:enhance>
			<Dialog.Header>
				<Dialog.Title>Create a quizz</Dialog.Title>
			</Dialog.Header>
			<Input placeholder="Quiz name" name="name" />
			<Dialog.Footer>
				<Button onclick={() => (new_quizz_dialog_open = false)} variant="outline">Cancel</Button>
				<Button type="submit">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
