<script>
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let {form} = $props();
</script>

<div class="px-8 py-4">
	<div class="mx-auto mt-28 max-w-screen-lg">
		<div class="flex justify-around">
			<div class="bg-background/50 px-6 py-6 rounded-md border border-accent">
				<form method="post" class="flex w-fit flex-col group" use:enhance>
					<Label class="mb-1" for="email">Email</Label>
					<Input required class="mb-4" type="email" id="email" name="email" />

					<Label class="mb-1" for="password">Password</Label>
					<Input required class="mb-1" type="password" id="password" name="password" />
					{#if form?.incorrect }
						<span class="text-sm text-neutral-500">Incorrect email or password</span>
					{/if}

					<div class="flex items-center text-sm gap-8 mt-4">
						<a href="/register" class="text-neutral-500 hover:text-white transition-all ">Sign up instead</a>
						<Button class="group-invalid:pointer-events-none group-invalid:opacity-50" type="submit">Log in!</Button>
					</div>
				</form>
			</div>
			<div class="flex flex-col items-end px-8">
				<span class="text-5xl font-bold mb-4">Log in</span>
				<span class="text-neutral-500 text-sm text-right w-[200px]">Don't worry, we've <span class="italic">never</span> been compromised
					<div class="inline relative text-xs bottom-1">*</div>
				</span>
			</div>
		</div>
	</div>
</div>
