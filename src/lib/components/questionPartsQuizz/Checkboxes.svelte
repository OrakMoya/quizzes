<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	let { part = $bindable(), review = false} = $props();
	if (!review) part.answer_data = Array(part.question_data.length).fill(false);
</script>

{#each part.question_data as value, i}
	<div class="flex w-fit items-center">
		{#if review}
			{#if part.answer_data[i] === part.correct_data[i]}
				"gas"
			{:else}
				"nije gas"
			{/if}
		{/if}
		<Checkbox bind:checked={part.answer_data[i]} id="checkbox-{i}" /><Label
			>{part.question_data[i]}</Label
		>
	</div>
{/each}
