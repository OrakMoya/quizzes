<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import QuestionPartForm from './QuestionPartForm.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { LoaderIcon, SaveIcon, TrashIcon } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { beforeNavigate, goto } from '$app/navigation';
	import { navigating } from '$app/state';
	let processing = $state(false);

	let { data, form } = $props(); // Data returned by +page.server.js
	let question = $state(data.question);
	let initialQuestion = $state.snapshot(data.question);

	let questionParts = $state(data.current_question_parts ?? []);
	let initialQuestionParts = $state.snapshot(data.current_question_parts ?? []);
	let leaveConfirmed = false;
	let confirmLeaveDialogOpen = $state(false);
	/** @type {URL|null} */
	let inProgressNavigationURL = $state(null);

	let questionPartsStringified = $state('');
	let transitionDuration = $state(0);
	let unsaved = $derived.by(() => {
		return (
			JSON.stringify($state.snapshot(question)) != JSON.stringify(initialQuestion) ||
			JSON.stringify(initialQuestionParts) != JSON.stringify($state.snapshot(questionParts))
		);
	});
	/**
	 * @type {HTMLFormElement}
	 */
	let questionForm;

	let deleteQuestionDialogOpen = $state(false);

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

	/**
	 * @param {number} i
	 */
	function movePartDown(i) {
		if (i < questionParts.length - 1) {
			[questionParts[i], questionParts[i + 1]] = [questionParts[i + 1], questionParts[i]];
		}
	}

	/**
	 * @param {number} i
	 */
	function movePartUp(i) {
		if (i >= 1) {
			[questionParts[i], questionParts[i - 1]] = [questionParts[i - 1], questionParts[i]];
		}
	}

	beforeNavigate(({ cancel, to }) => {
		if (unsaved) {
			if (to) inProgressNavigationURL = to.url;
			if (!leaveConfirmed) {
				cancel();
				confirmLeaveDialogOpen = true;
			}
			leaveConfirmed = false;
		}
	});

	$effect(() => {
		data;
		setTimeout(() => {
			if (inProgressNavigationURL && form?.success) {
				confirmLeaveDialogOpen = false;
				goto(inProgressNavigationURL);
				inProgressNavigationURL = null;
				return;
			}

			processing = false;

			question = data.question;
			questionParts = data.current_question_parts;
			initialQuestion = $state.snapshot(data.question);
			initialQuestionParts = $state.snapshot(data.current_question_parts ?? []);
			deleteQuestionDialogOpen = false;
		}, 1);

		transitionDuration = 0;
		setTimeout(() => (transitionDuration = 200), 5);
	});

	$effect(() => {
		questionPartsStringified = JSON.stringify($state.snapshot(questionParts));
	});
</script>

<svelte:head>
	<title>{question.question} - Quizzes</title>
</svelte:head>

<AlertDialog.Root bind:open={confirmLeaveDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<div class="flex w-full items-center justify-between gap-x-2">
				<Button
					variant="outline"
					onclick={() => {
						confirmLeaveDialogOpen = false;
						leaveConfirmed = false;
						inProgressNavigationURL = null;
					}}>Cancel</Button
				>
				<div class="flex items-center gap-x-2">
					<Button
						variant="destructive"
						onclick={() => {
							confirmLeaveDialogOpen = false;
							leaveConfirmed = true;
							if (inProgressNavigationURL) goto(inProgressNavigationURL);
						}}>Leave</Button
					>
					<Button
						onclick={(e) => {
							questionForm.requestSubmit();
							leaveConfirmed = true;
						}}
						disabled={!unsaved || processing}
					>
						{#if processing}
							<LoaderIcon class="animate-spin" />
						{:else}
							Save and leave
						{/if}
					</Button>
				</div>
			</div>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<div class="mt-4">
	<div class="flex items-center justify-between mb-4">
		<p class="text-2xl font-bold md:text-4xl">
			Question #{question.position}
		</p>
		<div class="flex gap-x-2">
			<Button form="questionForm" disabled={!unsaved || processing} type="submit">
				{#if processing}
					<LoaderIcon class="animate-spin" />
				{:else}
					<SaveIcon />
				{/if}
			</Button>
			<form onsubmit={() => (processing = true)}>
				<AlertDialog.Root bind:open={deleteQuestionDialogOpen}>
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

	<form
		onsubmit={() => (processing = true)}
		bind:this={questionForm}
		id="questionForm"
		method="post"
		action="?/save"
		use:enhance
	>
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

	<div>
		{#each questionParts as part, i (part)}
			<div
				transition:slide={{ duration: transitionDuration }}
				animate:flip={{ duration: transitionDuration }}
			>
				<QuestionPartForm
					index={i}
					bind:part={questionParts[i]}
					onMoveDown={() => movePartDown(i)}
					onMoveUp={() => movePartUp(i)}
					onDelete={() => (questionParts = questionParts.toSpliced(i, 1))}
				/>
			</div>
		{/each}
	</div>
	<Button onclick={addPart} variant="outline" class="w-full ">Add part</Button>
</div>
