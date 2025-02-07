<script>
	import { enhance } from '$app/forms';
	import Decider from '$lib/components/questionPartsQuizz/Decider.svelte';
	import { ChevronRightIcon } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let question = $state(data.question);
	let parts = $state(data.parts);
	let parts_stringified = $state('');

	let seconds = $state(data.time_left);
	let flip = $state(false);

	let date = $derived(new Date(seconds));

	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let countdownTimeout;

	function subtractSecond() {
		seconds -= 1000;
		flip = !flip;
		countdownTimeout = setTimeout(subtractSecond, 1000);
	}

	countdownTimeout = setTimeout(subtractSecond, 1000);
	onDestroy(() => {
		if (countdownTimeout) clearTimeout(countdownTimeout);
	});

	$effect(() => {
		question = data.question;
		parts = data.parts;
	});
	$effect(() => {
		parts_stringified = JSON.stringify($state.snapshot(parts));
	});
</script>

<div class="w-full pt-32">
	<p class="mb-6 text-3xl font-bold">
		<span class="mr-2 text-neutral-500">{question.position}:</span>
		{question.question}
	</p>
	{#key parts}
		<div class="grid grid-cols-1 gap-2">
			{#each parts as _, i}
				<div class="mb-8 bg-neutral-950 px-4 py-4 rounded-md border border-neutral-800">
					<Decider bind:part={parts[i]} />
				</div>
			{/each}
		</div>
	{/key}

	<div class="flex items-center gap-x-4 pl-8">
		<form method="post" use:enhance action="?/back">
			<input type="hidden" name="data" bind:value={parts_stringified} />
			<button class="group flex items-center justify-center py-2" type="submit">
				<div class="mr-4 translate-y-[1px]">
					<div
						transition:fade={{ duration: 50 }}
						class="absolute flex rotate-180 items-center justify-center group-hover:text-blue-300"
					>
						<ChevronRightIcon
							class="absolute size-6 opacity-25 transition-all group-enabled:group-hover:opacity-100"
						/>
						<ChevronRightIcon
							class="absolute size-6 opacity-0 transition-all group-hover:translate-x-[10px] group-enabled:group-hover:opacity-100"
						/>
						<ChevronRightIcon
							class="absolute size-6 opacity-0 transition-all group-hover:translate-x-[20px] group-enabled:group-hover:opacity-100"
						/>
					</div>
				</div>
				<span class="text-xl text-neutral-500 transition-all group-hover:text-white"> Back </span>
			</button>
		</form>
		<span data-flip={flip} class="rounded-md text-xl text-neutral-500 px-4 py-1">
			{date.toISOString().slice(14, 19)}
		</span>
		<form method="post" use:enhance action="?/next">
			<input type="hidden" name="data" bind:value={parts_stringified} />
			<button class="group flex items-center justify-center py-2 pl-2 pr-6" type="submit">
				<span class="text-xl text-neutral-500 transition-all group-hover:text-white"> Next </span>
				<div class="ml-4 translate-y-[1px]">
					<div
						transition:fade={{ duration: 50 }}
						class="absolute flex items-center justify-center group-hover:text-blue-300"
					>
						<ChevronRightIcon
							class="absolute size-6 opacity-25 transition-all group-enabled:group-hover:opacity-100"
						/>
						<ChevronRightIcon
							class="absolute size-6 opacity-0 transition-all group-hover:translate-x-[10px] group-enabled:group-hover:opacity-100"
						/>
						<ChevronRightIcon
							class="absolute size-6 opacity-0 transition-all group-hover:translate-x-[20px] group-enabled:group-hover:opacity-100"
						/>
					</div>
				</div>
			</button>
		</form>
	</div>
</div>
