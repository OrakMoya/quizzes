<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
	console.log(data);
</script>

{#each data.sessions as session}
	<div>
		<a href="/dashboard/quizzes/edit/{page.params.quizz_uuid}/session/{session.uuid}">
			{session.user.username} : {session.result.achieved}/{session.result.total}
		</a>
		<form method="POST" action="?/deleteSession" use:enhance>
			<input name="session_uuid" type="hidden" value={session.uuid} />
			<Button variant="destructive" type="submit">Delete</Button>
		</form>
	</div>
{/each}
