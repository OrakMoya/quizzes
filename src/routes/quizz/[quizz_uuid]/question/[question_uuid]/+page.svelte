<script>
	import { enhance } from '$app/forms';
	import Decider from '$lib/components/questionPartsQuizz/Decider.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data } = $props();
	let question = $state(data.question);
	let parts = $state(data.parts);
	let parts_stringified = $state('');
	console.log(data);

	$effect(() => {
		question = data.question;
		parts = data.parts;
	});
	$effect(() => {
		parts_stringified = JSON.stringify($state.snapshot(parts));
	});
</script>

<div>
	{question?.question}
</div>
{#key parts}
	{#each parts as part, i}
		{part.text}
		<Decider bind:part={parts[i]} />
	{/each}
{/key}

<form method="post" use:enhance>
	<input type="hidden" name="data" bind:value={parts_stringified} />
	<Button type="submit">Ok ae dalje</Button>
</form>
