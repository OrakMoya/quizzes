<script>
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '../ui/label';

	let { part = $bindable() } = $props();
	part.answer_data = "";
</script>

<RadioGroup.Root bind:value={part.answer_data}>
	{#each part.question_data as value, i}
		<div class="flex w-fit items-center">
			<RadioGroup.Item value="{i}-{part.question_data[i]}" id="{i}-{part.question_data[i]}" />
			<Label for="{i}-{part.question_data[i]}">{part.question_data[i]}</Label>
		</div>
	{/each}
</RadioGroup.Root>
