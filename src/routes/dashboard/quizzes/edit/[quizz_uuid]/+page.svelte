<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import {
		EyeIcon,
		ListCheckIcon,
		ListChecksIcon,
		LoaderIcon,
		SaveIcon,
		TrashIcon,
		ViewIcon
	} from 'lucide-svelte';
	import * as internationalized from '@internationalized/date';
	import DatePicker from '$lib/components/ui/date-picker/date-picker.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { beforeNavigate, goto } from '$app/navigation';

	const MAX_TS = 8640000000000000;

	let { data, form } = $props();
	let initial_state = $state('');

	let public_since = $state(
		data.quizz.public_since.getTime() !== 0
			? internationalized.fromDate(data.quizz.public_since, 'UTC')
			: internationalized.now('UTC')
	);
	let public_until = $state(
		data.quizz.public_until.getTime() !== MAX_TS
			? internationalized.fromDate(data.quizz.public_until, 'UTC')
			: internationalized.now('UTC')
	);

	let title = $state(data.quizz.title);
	let no_public_since = $state(data.quizz.public_since.getTime() === 0);
	let no_public_until = $state(data.quizz.public_until.getTime() === MAX_TS);

	let public_since_hours = $state(data.quizz.public_since.getHours());
	let public_until_hours = $state(data.quizz.public_until.getHours());

	let answers_visible_since = $state(
		data.quizz.answers_visible_since.getTime() !== MAX_TS
			? internationalized.fromDate(data.quizz.answers_visible_since, 'UTC')
			: internationalized.now('UTC').add({ days: 7 })
	);
	let answers_visible_since_hours = $state(data.quizz.answers_visible_since.getHours());

	let no_answers_visible_since = $state(data.quizz.answers_visible_since.getTime() === MAX_TS);

	let duration = $state(data.quizz.duration_minutes);

	$effect(() => {
		let info = {
			public_since: no_public_since
				? new Date(0)
				: public_since.set({ hour: public_since_hours }).toDate(),
			public_until: no_public_until
				? new Date(MAX_TS)
				: public_until.set({ hour: public_until_hours }).toDate(),
			answers_visible_since: no_answers_visible_since
				? new Date(MAX_TS)
				: answers_visible_since.set({ hour: answers_visible_since_hours }).toDate(),
			duration: duration,
			title: title
		};
		setTimeout(() => {
			basicInfoStringified = JSON.stringify(info);
			if (!initial_state) initial_state = basicInfoStringified;
		}, 1);
	});

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

	let processing = $state(false);

	$effect(() => {
		data;
		form;
		setTimeout(() => {
			if (inProgressNavigationURL && form?.success) {
				confirmLeaveDialogOpen = false;
				goto(inProgressNavigationURL);
				inProgressNavigationURL = null;
				return;
			}

			processing = false;
			if (form?.success) initial_state = basicInfoStringified;
		});
	});
	/**
	 * @type {HTMLFormElement}
	 */
	let basicInfoForm;
	let basicInfoStringified = $state('');
	let confirmLeaveDialogOpen = $state(false);
	/** @type {URL|null} */
	let inProgressNavigationURL = $state(null);
	let leaveConfirmed = $state(false);
	let unsaved = $derived(initial_state !== basicInfoStringified);
</script>

<svelte:head>
	<title>{data.quizz.title} - Quizzes</title>
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
							basicInfoForm.requestSubmit();
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

<section class="mt-4">
	<div class="mb-2 flex items-center justify-between">
		<p class="text-4xl font-bold">Base info</p>
		<form
			bind:this={basicInfoForm}
			id="basicInfoForm"
			onsubmit={() => (processing = true)}
			method="post"
			use:enhance
			action="?/update"
		>
			<input name="info" type="hidden" bind:value={basicInfoStringified} />
			<Button type="submit" disabled={initial_state === basicInfoStringified || processing}>
				{#if processing}
					<LoaderIcon class="animate-spin" />
				{:else}
					<SaveIcon />
				{/if}
			</Button>
		</form>
	</div>
	<div>
		<Label for="title">Title</Label>
		<Input
			required
			class="sm:w-1/2 md:w-1/3"
			id="title"
			type="text"
			min="0"
			max="100"
			bind:value={title}
		/>
	</div>
	<div class="mb-4 grid grid-cols-1 gap-x-4 md:grid-cols-2">
		<div class="flex flex-col gap-y-4">
			<div data-disabled={no_public_since} class="group">
				<Label class="">Available since</Label>
				<div class=" flex items-center gap-x-2">
					<Checkbox bind:checked={() => !no_public_since, (val) => (no_public_since = !val)} />
					<DatePicker bind:value={public_since} disabled={no_public_since} />
					<Input
						min="0"
						max="23"
						class="w-[70px]"
						type="number"
						bind:value={public_since_hours}
						disabled={no_public_since}
					/>
					<span class="text-lg group-data-[disabled=true]:text-neutral-500">h</span>
				</div>
			</div>

			<div data-disabled={no_public_until} class="group">
				<Label class="">Available until</Label>
				<div class="flex items-center gap-x-2">
					<Checkbox bind:checked={() => !no_public_until, (val) => (no_public_until = !val)} />
					<DatePicker bind:value={public_until} disabled={no_public_until} />
					<Input
						min="0"
						max="23"
						class="w-[70px]"
						type="number"
						bind:value={public_until_hours}
						disabled={no_public_until}
					/>
					<span class="text-lg group-data-[disabled=true]:text-neutral-500">h</span>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-y-4">
			<div>
				<Label for="duration">Duration (minutes)</Label>
				<Input min="2" class="w-[70px]" id="duration" type="number" bind:value={duration} />
			</div>
			<div data-disabled={no_answers_visible_since} class="group">
				<Label>Answers available since</Label>
				<div class="flex items-center gap-x-2">
					<Checkbox
						bind:checked={() => !no_answers_visible_since,
						(val) => (no_answers_visible_since = !val)}
					/>
					<DatePicker bind:value={answers_visible_since} disabled={no_answers_visible_since} />
					<Input
						min="0"
						max="23"
						class="w-[70px]"
						type="number"
						bind:value={answers_visible_since_hours}
						disabled={no_answers_visible_since}
					/>
					<span class="text-lg group-data-[disabled=true]:text-neutral-500">h</span>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="mt-8">
	<p class="mb-4 text-3xl font-bold">Results</p>
	{#if data.sessions.length}
		<ul>
			{#each data.sessions as session}
				<li
					class=" grid grid-cols-4 content-center items-center gap-2 rounded-md px-4 py-4 text-center text-lg odd:bg-black/40 md:grid-cols-5 md:py-2"
				>
					<span>{session.user.username}</span>
					<span>{Math.floor(session.result.achieved * 100) / 100}</span>
					<span>{session.result.total}</span>
					<span
						>{(Math.floor((session.result.achieved / session.result.total) * 100) / 100) *
							100}%</span
					>
					<div class="flex w-full gap-x-2 md:items-center md:justify-end">
						<a href="/dashboard/quizzes/edit/{page.params.quizz_uuid}/session/{session.uuid}">
							<Button><ListChecksIcon /></Button>
						</a>
						<form class="w-fit" method="POST" action="?/deleteSession" use:enhance>
							<input name="session_uuid" type="hidden" value={session.uuid} />
							<Button variant="destructive" type="submit"><TrashIcon /></Button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-neutral-500">Empty...</p>
	{/if}
</section>
