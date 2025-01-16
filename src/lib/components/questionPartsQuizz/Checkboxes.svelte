<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	let { part = $bindable(), review = false } = $props();
	if (!review) part.answer_data = Array(part.question_data.length).fill(false);
</script>

<div>
	{#each part.question_data as value, i}
		<div
			data-review={review}
			data-correct={part.answer_data[i] === part.correct_data.at(i)}
			class="
				flex items-center gap-x-2
				px-4 py-2
				first:rounded-t-md
				last:rounded-b-md
				data-[review=true]:data-[correct=false]:bg-red-800 data-[review=true]:data-[correct=true]:bg-green-800
				"
		>
			<Checkbox disabled={review} bind:checked={part.answer_data[i]} id="checkbox-{i}" /><Label
				>{part.question_data[i]}</Label
			>
		</div>
	{/each}
</div>
