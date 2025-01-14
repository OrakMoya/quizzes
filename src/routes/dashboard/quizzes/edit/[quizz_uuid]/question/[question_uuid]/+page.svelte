<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import QuestionPartForm from './QuestionPartForm.svelte';

	let { data } = $props(); // Data returned by +page.server.js
	let question = $state(data.question);

	let questionParts = $state(data.current_question_parts ?? []);
	let questionPartsStringified = $state('');

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
	});
	$effect(() => {
		questionParts = data.current_question_parts;
	});
	$effect(() => {
		questionPartsStringified = JSON.stringify($state.snapshot(questionParts));
	});
</script>

{question.question}

<form method="post" action="?/save" use:enhance>
	<Input type="text" bind:value={question.question} name="question" />
	<input type="hidden" name="question_parts" bind:value={questionPartsStringified} />
	<Button type="submit">Save</Button>
</form>
<Button onclick={addPart}>Add Question Part</Button>

{#each questionParts as _, i}
	<QuestionPartForm
		bind:part={questionParts[i]}
		onDelete={() => (questionParts = questionParts.toSpliced(i, 1))}
	/>
{/each}
