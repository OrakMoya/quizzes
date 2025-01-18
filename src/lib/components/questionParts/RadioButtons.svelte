<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { TrashIcon } from 'lucide-svelte';

	let { part = $bindable() } = $props();
	if (!part.question_data || !part.question_data.length) {
		part.question_data = ['Example'];
		part.correct_data = '0-Example';
	}

	function addOption() {
		part.question_data.push('');
	}
</script>

<div>
	<RadioGroup.Root bind:value={part.correct_data} class="mb-2">
		{#each part.question_data as _, i}
			<div class="flex w-full md:w-fit items-center gap-x-4 pl-4">
				<RadioGroup.Item
					value="{i}-{part.question_data[i]}"
					id="{i}-{part.question_data[i]}"
				/><Input
					type="text"
					bind:value={() => part.question_data[i],
					(value) => {
						if (part.correct_data === `${i}-${part.question_data[i]}`) {
							part.correct_data = `${i}-${value}`;
						}
						part.question_data[i] = value;
					}}
				/>
				<Button
					variant="ghost"
					onclick={() => {
						part.question_data.splice(i, 1);
					}}><TrashIcon /></Button
				>
			</div>
		{/each}
	</RadioGroup.Root>
	<Button onclick={addOption} variant="ghost">Add option</Button>
</div>
