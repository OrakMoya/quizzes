<script>
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '../ui/label';

	let { part = $bindable(), review = false } = $props();
	if (!review) part.answer_data = '';
</script>

<RadioGroup.Root bind:value={part.answer_data}>
	{#each part.question_data as value, i}
		<div class="flex w-fit items-center">
			{#if review}
				{#if part.answer_data[i] === part.correct_data[i]}
					"gas"
				{:else}
					"nije gas"
				{/if}
			{/if}
			<RadioGroup.Item value="{i}-{part.question_data[i]}" id="{i}-{part.question_data[i]}" />
			<Label for="{i}-{part.question_data[i]}">{part.question_data[i]}</Label>
		</div>
	{/each}
</RadioGroup.Root>
