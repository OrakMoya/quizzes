<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
	console.log(data);
</script>

quizz!!
{data.quizz.title}

<form method="post" use:enhance>
	<button type="submit">Take</button>
</form>
