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

<div class="flex overflow-x-scroll p-4 gap-x-4">
	{#each data.questions as question}
		<a class="w-fit whitespace-nowrap" href="/dashboard/quizzes/edit/{page.params.quizz_uuid}/question/{question.uuid}">#{question.position} : {question.question}</a>
	{/each}
</div>

{@render children()}
