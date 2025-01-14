<script>
	import Decider from '$lib/components/questionParts/Decider.svelte';
	import { Button } from '$lib/components/ui/button';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import { Input } from '$lib/components/ui/input';

	let { part = $bindable(), onDelete = () => {} } = $props();
</script>

<div>
	<Combobox
		bind:value={part.type}
		onChange={() => {
			part.question_data = [];
			part.correct_data = null;
		}}
		options={[
			{ value: 'radio', label: 'Radio buttons' },
			{ value: 'checkbox', label: 'Checkboxes' }
		]}
	/>
	<Button variant="destructive" onclick={() => onDelete()}>Delete</Button>

	<Input type="text" bind:value={part.text} />
	<Input type="number" bind:value={part.carries} placeholder="Carries" />
	<Input type="number" bind:value={part.wrong_carries} placeholder="Wrong carries" />
	<Decider bind:part />
</div>
