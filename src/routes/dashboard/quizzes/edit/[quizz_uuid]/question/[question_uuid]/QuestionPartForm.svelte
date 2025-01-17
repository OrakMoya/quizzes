<script>
	import Decider from '$lib/components/questionParts/Decider.svelte';
	import { Button } from '$lib/components/ui/button';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { MoveDownIcon, MoveUpIcon, TrashIcon } from 'lucide-svelte';

	let { 
		part = $bindable(),
		onDelete = () => {}, 
		onMoveUp = ()=>{},
		onMoveDown = ()=>{},
		index = $bindable(0) 
	} = $props();
</script>

<div class="mb-2 flex rounded-md border border-accent bg-background p-4 py-6">
	<div class="w-full">
		<div class="mb-1 flex items-center justify-between gap-x-2">
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
	<div class="flex flex-col justify-between gap-2 items-center">
		<div class="flex flex-col gap-2 items-center justify-center">
			<Button variant="outline" onclick={() => onMoveUp()}><MoveUpIcon /></Button>
			<Button variant="outline" onclick={() => onMoveDown()}><MoveDownIcon /></Button>
		</div>
		<div>
			<Button variant="destructive" onclick={() => onDelete()}><TrashIcon /></Button>
		</div>
	</div>
</div>
