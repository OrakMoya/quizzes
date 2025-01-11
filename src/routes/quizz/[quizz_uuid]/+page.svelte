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
