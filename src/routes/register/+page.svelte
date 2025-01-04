<script>
	import { enhance } from '$app/forms';
</script>

<form method="post" class="flex w-fit flex-col" use:enhance>
	<label for="username">Username</label>
	<input type="text" id="username" class="text-black" name="username" />

	<label for="email">Email</label>
	<input type="email" id="email" class="text-black" name="email" />

	<label for="password">Password</label>
	<input type="password" id="password" class="text-black" name="password" />

	<button type="submit">Šalji ga</button>
</form>
