<script>
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { PlusIcon } from 'lucide-svelte';

	let { data } = $props();

	console.log(data);

	let new_quizz_dialog_open = $state(false);
</script>

<Dialog.Root bind:open={new_quizz_dialog_open}>
	<Dialog.Trigger>
		<PlusIcon />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create a quizz</Dialog.Title>
		</Dialog.Header>
		<Input placeholder="name" />
		<Dialog.Footer>
			<Button onclick={() => (new_quizz_dialog_open = false)} variant="outline">Cancel</Button>
			<Button>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
