<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
</script>

<form method="post" class="flex w-fit flex-col" use:enhance>
	<label for="email">Email</label>
	<input type="email" id="email" class="text-black" name="email" />

	<label for="password">Password</label>
	<input type="password" id="password" class="text-black" name="password" />

	{#if page.form?.message}
		<div>{page.form.message}</div>
	{/if}

	<button type="submit">Šalji ga</button>
	<a href="/register">Sign up instead</a>
</form>
