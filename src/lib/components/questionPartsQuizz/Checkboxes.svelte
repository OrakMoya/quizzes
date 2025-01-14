<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { part = $bindable() } = $props();
	part.answer_data = Array(part.question_data.length).fill(false);
</script>

{#each part.question_data as value, i}
	<div class="flex w-fit items-center">
		<Checkbox bind:checked={part.answer_data[i]} id="checkbox-{i}" /><Label
			>{part.question_data[i]}</Label
		>
	</div>
{/each}
