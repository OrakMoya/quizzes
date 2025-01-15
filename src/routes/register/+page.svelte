<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { form } = $props();

	let password = $state('');
	let password_confirmation = $state('');
</script>

<div class="px-8 py-4">
	<div class="mx-auto mt-28 max-w-screen-lg">
		<div class="flex justify-around">
			<div class="rounded-md border border-accent bg-background/50 px-6 py-6">
				<form method="post" class="group flex w-fit flex-col" use:enhance>
					<Label class="mb-1" for="username">Username</Label>
					<Input required class="mb-4" type="text" id="username" name="username" />

					<Label class="mb-1" for="email">Email</Label>
					<Input required class="mb-4" type="email" id="email" name="email" />

					<Label class="mb-1" for="password">Password</Label>
					<Input
						required
						bind:value={password}
						class="mb-4"
						type="password"
						id="password"
						name="password"
					/>

					<Label class="mb-1" for="password">Confirm password</Label>
					<Input
						required
						bind:value={password_confirmation}
						class="mb-1"
						type="password"
						id="password"
						name="password_confirmation"
					/>
					{#if ((password || password_confirmation) && password !== password_confirmation) || form?.passwords_dont_match}
						<span class="text-sm text-neutral-500">Passwords don't match</span>
					{/if}

					<div class="flex items-center gap-8 text-sm mt-6">
						<a href="/login" class="text-neutral-500 transition-all hover:text-white"
							>Log in instead</a
						>
						<Button
							class="group-invalid:pointer-events-none group-invalid:opacity-50"
							disabled={password !== password_confirmation}
							type="submit">Sign up!</Button
						>
					</div>
				</form>
			</div>
			<div class="flex flex-col items-end px-8">
				<span class="mb-4 text-5xl font-bold">Sign up</span>
				<span class="w-[200px] text-right text-sm text-neutral-500"
					>Don't worry, we've <span class="italic">never</span> been compromised
					<div class="relative bottom-1 inline text-xs">*</div>
				</span>
			</div>
		</div>
	</div>
</div>
