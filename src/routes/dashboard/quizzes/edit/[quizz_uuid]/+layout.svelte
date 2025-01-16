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
				behavior: 'smooth'
			});
		}
	});

	let codeRecentlyCopied = $state(false);
</script>

<div class="mx-auto max-w-screen-lg">
	<div class="flex items-center gap-x-2">
		<a
			class="w-fit whitespace-nowrap rounded-md border border-accent border-opacity-0 p-2 data-[focused=true]:border-opacity-100 data-[focused=true]:bg-background"
			data-focused={page.url.pathname.endsWith(page.params.quizz_uuid)}
			href="/dashboard/quizzes/edit/{page.params.quizz_uuid}">Results</a
		>
		<div
			class="flex w-full items-center justify-start gap-x-2 overflow-scroll rounded-md border border-accent"
		>
			{#each data.questions as question}
				<div
					data-focused={page.url.pathname.endsWith(question.uuid)}
					class="group flex w-fit items-center justify-start border-x border-accent border-opacity-0 first:border-l-0 last:border-r-0 data-[focused=true]:border-opacity-100"
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
				setTimeout(() => (codeRecentlyCopied = false), 2000);
			}}
		>
			<div class="relative size-4">
				{#if codeRecentlyCopied}
					<div transition:fade={{ duration: 100 }} class="absolute h-full w-full">
						<CopyCheck class="size-4" />
					</div>
				{:else}
					<!-- else content here -->
					<div transition:fade={{ duration: 100 }} class="absolute h-full w-full">
						<Copy class="size-4" />
					</div>
				{/if}
			</div>
		</Button>
	</div>

	{@render children()}
</div>
