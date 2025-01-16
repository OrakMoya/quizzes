<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import QuestionPartForm from './QuestionPartForm.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { SaveIcon, TrashIcon } from 'lucide-svelte';

	let { data, form } = $props(); // Data returned by +page.server.js
	let question = $state(data.question);

	let questionParts = $state(data.current_question_parts ?? []);
	let questionPartsStringified = $state('');

	let delete_question_dialog_open = $state(false);

	function addPart() {
		questionParts.push({
			uuid: '',
			question_uuid: question.uuid,
			type: 'checkbox',
			text: '',
			question_data: [],
			correct_data: [],
			carries: 1,
			wrong_carries: 0.25
		});
	}

	$effect(() => {
		question = data.question;
		questionParts = data.current_question_parts;
		delete_question_dialog_open = false;
	});

	$effect(() => {
		questionPartsStringified = JSON.stringify($state.snapshot(questionParts));
	});
</script>

<div class="mt-8">
	<div class="flex items-center justify-between">
		<p class="mb-4 text-4xl font-bold">
			Question #{question.position}
		</p>
		<div class="flex gap-x-2">
			<Button form="questionForm" type="submit"><SaveIcon /></Button>
			<form>
				<AlertDialog.Root bind:open={delete_question_dialog_open}>
					<AlertDialog.Trigger>
						{#snippet child({ props })}
							<Button variant="destructive" {...props}>
								<TrashIcon />
							</Button>
						{/snippet}
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you sure?</AlertDialog.Title>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<form method="post" action="?/deleteQuestion" use:enhance>
								<Button type="submit" variant="destructive">Delete</Button>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</form>
		</div>
	</div>

	<form id="questionForm" method="post" action="?/save" use:enhance>
		<Label for="question_text" class="text-neutral-500">Question text:</Label>
		<input
			class="mb-2 block w-full rounded-md border border-accent bg-background px-2 py-2 text-xl text-white"
			type="text"
			bind:value={question.question}
			name="question"
			id="question_text"
		/>
		<input type="hidden" name="question_parts" bind:value={questionPartsStringified} />
	</form>

	{#each questionParts as _, i}
		<QuestionPartForm
			index={i}
			bind:part={questionParts[i]}
			onDelete={() => (questionParts = questionParts.toSpliced(i, 1))}
		/>
	{/each}
	<Button onclick={addPart} variant="outline" class="w-full ">Add part</Button>
</div>
