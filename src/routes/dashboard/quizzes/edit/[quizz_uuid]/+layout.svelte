<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Copy, CopyCheck, CopyCheckIcon, CopyIcon, PlusIcon } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data, children } = $props();
	$effect(() => {
		if (page.url.pathname.search('question') !== -1) {
			document.getElementById(`question-${page.params.question_uuid}`)?.scrollIntoView({
				inline: 'center',
				block: 'nearest',
				behavior: 'smooth'
			});
		}
	});

	let codeRecentlyCopied = $state(false);
</script>

<div class="mx-auto max-w-screen-lg">
	<div class="flex flex-col items-center justify-between gap-x-4 gap-y-4 md:flex-row">
		<div
			class="flex w-full basis-auto items-center justify-start gap-x-2 overflow-scroll rounded-xl border border-neutral-700 bg-neutral-800"
		>
			{#each data.questions as question}
				<div
					data-focused={page.url.pathname.endsWith(question.uuid)}
					class="group flex w-fit items-center justify-start border-x border-neutral-600 border-opacity-0 first:border-l-0 last:border-r-0 data-[focused=true]:border-opacity-100"
				>
					<a
						id="question-{question.uuid}"
						class="w-fit whitespace-nowrap px-4 py-4 group-data-[focused=true]:bg-background"
						href="/dashboard/quizzes/edit/{page.params.quizz_uuid}/question/{question.uuid}"
						>{question.position} : {question.question.length < 7
							? question.question
							: question.question.substring(0, 7) + '...'}</a
					>
				</div>
			{/each}
			{#if !data.questions.length}
				<p class="p-2 py-4 text-sm text-neutral-500">No questions yet...</p>
			{/if}
		</div>
		<div class="flex w-full items-center justify-between gap-x-4 md:w-fit">
			<a
				class="w-fit whitespace-nowrap rounded-md border border-neutral-700 bg-neutral-800 px-6 py-2 data-[focused=true]:bg-background"
				data-focused={page.url.pathname.endsWith(page.params.quizz_uuid)}
				href="/dashboard/quizzes/edit/{page.params.quizz_uuid}">Info</a
			>
			<div class="flex items-center gap-x-2">
				<form
					action={'/dashboard/quizzes/edit/' + page.params.quizz_uuid + '?/addQuestion'}
					method="post"
					use:enhance
				>
					<Button type="submit"><PlusIcon class="" /></Button>
				</form>
				<Button
					onclick={() => {
						navigator.clipboard.writeText(data.quizz.uuid.substring(0, 5));
						codeRecentlyCopied = true;
						setTimeout(() => (codeRecentlyCopied = false),  2000);
					}}
				>
					<div class="relative size-4">
						{#if codeRecentlyCopied}
							<div transition:fade={{ duration: 100 }} class="absolute h-full w-full">
								<CopyCheck class="size-4" />
							</div>
						{:else}
							<div transition:fade={{ duration: 100 }} class="absolute h-full w-full">
								<Copy class="size-4" />
							</div>
						{/if}
					</div>
				</Button>
			</div>
		</div>
	</div>

	<div class="my-4 grid grid-cols-1 gap-x-4 gap-y-2 text-center md:grid-cols-3">
		<p class="content-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm">
			A quizz must have at least one question with one question part.
		</p>
		<p class="content-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm">
			Questions without any parts are skipped.
		</p>
		<p class="content-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm">
			Both the question and it's parts can have text.
		</p>
	</div>
	{#if data.empty_questions}
		<div class="w-full px-4 py-2 rounded-md border border-red-900 bg-red-950">The quizz has empty questions. <a class="underline" data-sveltekit-preload-data="off" data-sveltekit-reload href="/dashboard/quizzes/edit/{page.params.quizz_uuid}/cleanup">Clean up</a></div>
	{/if}

	{@render children()}
</div>
