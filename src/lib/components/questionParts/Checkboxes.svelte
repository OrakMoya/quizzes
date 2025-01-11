<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';

	let { part = $bindable() } = $props();
	if (!part.data || !part.data.length) part.data = [{ text: 'Example', correct_state: false }];

	function addOption() {
		part.data.push({ text: '', correct_state: false });
	}
</script>

{#each part.data as value, i}
	<div class="flex w-fit items-center">
		<Checkbox bind:checked={part.data[i].correct_state} id="checkbox-{i}" /><Input
			type="text"
			bind:value={part.data[i].text}
		/>
	</div>
{/each}
<Button onclick={addOption}>Add</Button>
