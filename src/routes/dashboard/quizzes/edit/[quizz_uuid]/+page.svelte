<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { EyeIcon, ListCheckIcon, ListChecksIcon, TrashIcon, ViewIcon } from 'lucide-svelte';
	import * as internationalized from '@internationalized/date';
	import DatePicker from '$lib/components/ui/date-picker/date-picker.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	const MAX_TS = 8640000000000000;

	let { data } = $props();

	let public_since = $state(
		data.quizz.public_since.getTime() !== 0
			? internationalized.fromDate(data.quizz.public_since, 'UTC')
			: internationalized.now('UTC')
	);
	let public_until = $state(
		data.quizz.public_until.getTime() !== MAX_TS
			? internationalized.fromDate(data.quizz.public_since, 'UTC')
			: internationalized.now('UTC')
	);

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
			duration: duration
		};
		setTimeout(() => (basicInfoStringified = JSON.stringify(info)), 1);
	});
	let basicInfoStringified = $state('');
</script>

<section class="mt-8">
	<p class="mb-2 text-4xl font-bold">Base info</p>
	<div class="grid grid-cols-1 md:grid-cols-2 mb-4 gap-x-4">
		<div class="flex flex-col gap-y-2">
			<div>
				<Label class="">Available since</Label>
				<div class=" flex items-center gap-x-2">
					<Checkbox bind:checked={no_public_since} />
					<DatePicker bind:value={public_since} disabled={no_public_since} />
					<Input
						min="0"
						max="23"
						class="w-[70px]"
						type="number"
						bind:value={public_since_hours}
						disabled={no_public_since}
						oninput={() => {
							if (public_since_hours > 23) public_since_hours = 23;
							if (public_since_hours < 0) public_since_hours = 0;
						}}
					/>
				</div>
			</div>

			<div>
				<Label class="">Available until</Label>
				<div class="flex items-center gap-x-2">
					<Checkbox bind:checked={no_public_until} />
					<DatePicker bind:value={public_until} disabled={no_public_until} />
					<Input
						min="0"
						max="23"
						class="w-[70px]"
						type="number"
						bind:value={public_until_hours}
						disabled={no_public_until}
						oninput={() => {
							if (public_until_hours > 23) public_until_hours = 23;
							if (public_until_hours < 0) public_until_hours = 0;
						}}
					/>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-y-2">
			<div>
				<Label for="duration">Duration (minutes)</Label>
				<Input
					class="w-[70px]"
					id="duration"
					type="number"
					bind:value={duration}
					oninput={() => {
						if (duration < 0) duration = 0;
					}}
				/>
			</div>
			<div>
				<Label>Answers available since</Label>
				<div class="flex items-center gap-x-2">
					<Checkbox bind:checked={no_answers_visible_since} />
					<DatePicker bind:value={answers_visible_since} disabled={no_answers_visible_since} />
					<Input
						min="0"
						max="23"
						class="w-[70px]"
						type="number"
						bind:value={answers_visible_since_hours}
						disabled={no_answers_visible_since}
						oninput={() => {
							if (answers_visible_since_hours > 23) answers_visible_since_hours = 23;
							if (answers_visible_since_hours < 0) answers_visible_since_hours = 0;
						}}
					/>
				</div>
			</div>
		</div>
	</div>
	<form method="post" use:enhance action="?/update">
		<input name="info" type="hidden" bind:value={basicInfoStringified} />
		<Button type="submit">Save</Button>
	</form>
</section>

<section class="mt-8">
	<p class="mb-4 text-3xl font-bold">Results</p>
	{#if data.sessions.length}
		<!-- content here -->
		<ul>
			{#each data.sessions as session}
				<li
					class=" grid grid-cols-4 content-center items-center rounded-md px-4 py-2 text-center text-lg odd:bg-black/40 md:grid-cols-5"
				>
					<span>{session.user.username}</span>
					<span>{Math.floor(session.result.achieved * 100) / 100}</span>
					<span>{session.result.total}</span>
					<span
						>{(Math.floor((session.result.achieved / session.result.total) * 100) / 100) *
							100}%</span
					>
					<div class="flex w-full items-center justify-end gap-x-2">
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
