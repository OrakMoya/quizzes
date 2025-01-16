<script>
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '../ui/label';

	let { part = $bindable(), review = false } = $props();
	if (!review) part.answer_data = '';
	console.log(part);
</script>

<div>
	<RadioGroup.Root
		bind:value={part.answer_data}
		data-review={review}
		class="data-[review=true]:gap-0"
	>
		{#each part.question_data as value, i}
			<div
				data-review={review}
				data-correct={part.answer_data === part.correct_data ||
					`${i}-${part.question_data[i]}` == part.correct_data}
				class="
				flex items-center gap-x-2
				px-4 first:rounded-t last:rounded-b
				data-[review=true]:data-[correct=false]:bg-red-800
				data-[review=true]:data-[correct=true]:bg-green-800 data-[review=true]:py-2
				"
			>
				<RadioGroup.Item
					class=""
					disabled={review}
					value="{i}-{part.question_data[i]}"
					id="{i}-{part.question_data[i]}"
				/>
				<Label class="w-full" for="{i}-{part.question_data[i]}">{part.question_data[i]}</Label>
			</div>
		{/each}
	</RadioGroup.Root>
</div>
