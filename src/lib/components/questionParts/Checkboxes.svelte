<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';

	let { part = $bindable() } = $props();
	if (!part.question_data || !part.question_data.length) {
		part.question_data = ['Example'];
		part.correct_data = [true];
	}

	function addOption() {
		part.question_data.push('');
		part.correct_data.push(false);
	}
</script>

<div>
	<div class="mb-2">
		{#each part.question_data as _, i}
			<div class="flex w-fit items-center gap-x-2 mb-1 pl-4">
				<Checkbox bind:checked={part.correct_data[i]} id="checkbox-{i}" /><Input
					type="text"
					bind:value={part.question_data[i]}
				/>
			</div>
		{/each}
	</div>
	<Button onclick={addOption} variant="ghost">Add option</Button>
</div>
