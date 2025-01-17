<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
	console.log(data);
</script>

<section class="mt-8">
	<p class="mb-4 text-4xl font-bold">Results</p>
	<ul>
		{#each data.sessions as session}
			<li
				class=" grid grid-cols-5 content-center items-center rounded-md px-4 py-2 text-center text-lg odd:bg-black/40"
			>
				<span>{session.user.username}</span>
				<span>{session.result.achieved}</span>
				<span>{session.result.total}</span>
				<span>{(session.result.achieved / session.result.total) * 100}%</span>
				<div class="flex w-full items-center justify-end gap-x-2">
					<a href="/dashboard/quizzes/edit/{page.params.quizz_uuid}/session/{session.uuid}">
						<Button>View</Button>
					</a>
					<form class="w-fit" method="POST" action="?/deleteSession" use:enhance>
						<input name="session_uuid" type="hidden" value={session.uuid} />
						<Button variant="destructive" type="submit">Delete</Button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
</section>
