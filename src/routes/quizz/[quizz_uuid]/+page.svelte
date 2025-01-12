<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
	console.log(data);
</script>

quizz!!
{data.quizz.title}

{#if data.session}
	<form method="post" use:enhance action="?/continue">
		<button type="submit">Continue</button>
	</form>
{/if}
<form method="post" use:enhance action="?/new">
	<button type="submit">Take</button>
</form>

{#each data.past_results as past_result}
	<div>{past_result.achieved}/{past_result.total}</div>
{/each}
