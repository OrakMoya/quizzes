<script>
	import Decider from '$lib/components/questionParts/Decider.svelte';
	import { Button } from '$lib/components/ui/button';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { TrashIcon } from 'lucide-svelte';

	let { part = $bindable(), onDelete = () => {}, index = $bindable(0) } = $props();
</script>

<div class="mb-2 rounded-md border border-accent bg-background p-4 py-6">
	<div class="w-fit">
		<div class="mb-1 flex items-center gap-x-2">
			<Button variant="ghost" onclick={() => onDelete()}><TrashIcon /></Button>
			<span class="text-xl font-bold">Question part {index + 1}</span>
		</div>
		<div class="mb-2 flex flex-wrap gap-x-2">
			<div class="flex w-fit items-end gap-x-2">
				<div>
					<Label for="question-part-text">Part text:</Label>
					<Input id="question-part-text" type="text" bind:value={part.text} />
				</div>
				<div class="">
					<Label>Type:</Label>
					<div>
						<Combobox
							bind:value={part.type}
							onChange={() => {
								part.question_data = [];
								part.correct_data = null;
							}}
							class="grow"
							options={[
								{ value: 'radio', label: 'Radio buttons' },
								{ value: 'checkbox', label: 'Checkboxes' }
							]}
						/>
					</div>
				</div>
			</div>
			<div class="flex w-fit gap-x-2">
				<div>
					<Label for="carries">Points for correct</Label>
					<Input type="number" bind:value={part.carries} id="carries" placeholder="Carries" />
				</div>
				<div>
					<Label for="wrong-carries">Points for incorrect</Label>
					<Input
						type="number"
						bind:value={part.wrong_carries}
						id="wrong-carries"
						placeholder="Wrong carries"
					/>
				</div>
			</div>
		</div>
		<Decider bind:part />
	</div>
</div>
