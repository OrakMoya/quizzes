<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';

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
		{#each part.question_data as value, i}
			<div class="flex w-fit items-center gap-x-2 pl-4">
				<RadioGroup.Item
					value="{i}-{part.question_data[i]}"
					id="{i}-{part.question_data[i]}"
				/><Input
					type="text"
					bind:value={() => part.question_data[i],
					(value) => {
						if (part.correct_data === `${i}-${part.question_data[i]}`) {
							console.log(part.correct_data);
							part.correct_data = `${i}-${value}`;
							console.log(part.correct_data);
						}
						part.question_data[i] = value;
					}}
				/>
			</div>
		{/each}
	</RadioGroup.Root>
	<Button onclick={addOption} variant="ghost">Add option</Button>
</div>
