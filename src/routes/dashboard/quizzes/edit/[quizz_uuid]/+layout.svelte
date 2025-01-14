<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'lucide-svelte';

	let { data, children } = $props();
</script>

<form
	action={'/dashboard/quizzes/edit/' + page.params.quizz_uuid + '?/addQuestion'}
	method="post"
	use:enhance
>
	<Button type="submit"><PlusIcon /></Button>
</form>
<Button onclick={() => navigator.clipboard.writeText(data.quizz.uuid.substr(0, 5))}
	>Copy code</Button
>

<div class="flex gap-x-4 overflow-x-scroll p-4">
	<a class="w-fit whitespace-nowrap" href="/dashboard/quizzes/edit/{page.params.quizz_uuid}">Results</a>
	{#each data.questions as question}
		<a
			class="w-fit whitespace-nowrap"
			href="/dashboard/quizzes/edit/{page.params.quizz_uuid}/question/{question.uuid}"
			>#{question.position} : {question.question}</a
		>
	{/each}
</div>

{@render children()}
