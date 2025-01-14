<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
	console.log(data);
</script>

{#each data.sessions as session}
	<div>
		{session.user.username} : {session.result.achieved}/{session.result.total}
		<form method="POST" action="?/delete" use:enhance>
			<input name="session_uuid" type="hidden" value="{session.uuid}" />
			<Button variant="destructive" type="submit">Delete</Button>
		</form>
	</div>
{/each}
