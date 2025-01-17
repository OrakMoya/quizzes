<script>
	import { enhance } from '$app/forms';
	import Decider from '$lib/components/questionPartsQuizz/Decider.svelte';
	import { ChevronRightIcon } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let question = $state(data.question);
	let parts = $state(data.parts);
	let parts_stringified = $state('');
	console.log(data);

	$effect(() => {
		question = data.question;
		parts = data.parts;
	});
	$effect(() => {
		parts_stringified = JSON.stringify($state.snapshot(parts));
	});
</script>

<div class="w-full">
	<p class="mb-6 text-3xl font-bold">
		<span class="mr-2 text-neutral-500">{question.position}:</span>
		{question.question}
	</p>
	{#key parts}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
			{#each parts as part, i}
				<div class="mb-8">
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
