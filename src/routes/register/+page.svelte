<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { form } = $props();

	let password = $state('');
	let password_confirmation = $state('');
	$effect(() => {
		console.log(form);
	});
</script>

<div class="px-8 py-4">
	<div class="mx-auto mt-28 max-w-screen-lg">
		<div class="flex justify-around">
			<div class="rounded-md border border-accent bg-background/50 px-6 py-6">
				<form method="post" class="group flex w-fit flex-col" use:enhance>
					<Label class="mb-1" for="username">Username</Label>
					<Input required class="mb-1" type="text" id="username" name="username" />
					{#if form?.username_missing }
						<span class="text-sm text-neutral-500">A username is required</span>
					{/if}
					{#if form?.username_taken }
						<span class="text-sm text-neutral-500">This username is taken</span>
					{/if}

					<Label class="mb-1 mt-4" for="email">Email</Label>
					<Input required class="mb-1" type="email" id="email" name="email" />
					{#if form?.email_missing }
						<span class="text-sm text-neutral-500">An email is required</span>
					{/if}
					{#if form?.email_taken }
						<span class="text-sm text-neutral-500">This email is taken</span>
					{/if}

					<Label class="mb-1 mt-4" for="password">Password</Label>
					<Input
						required
						bind:value={password}
						class="mb-4"
						type="password"
						id="password"
						name="password"
					/>
					{#if form?.password_missing }
						<span class="text-sm text-neutral-500">A password is required</span>
					{/if}

					<Label class="mb-1" for="password_confirmation">Confirm password</Label>
					<Input
						required
						bind:value={password_confirmation}
						class="mb-1"
						type="password"
						id="password_confirmation"
						name="password_confirmation"
					/>
					{#if ((password || password_confirmation) && password !== password_confirmation) || form?.passwords_dont_match}
						<span class="text-sm text-neutral-500">Passwords don't match</span>
					{/if}

					<div class="mt-6 flex items-center gap-8 text-sm">
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
			<div class="hidden md:flex flex-col items-end px-8">
				<span class="mb-4 text-5xl font-bold">Sign up</span>
				<span class="w-[200px] text-right text-sm text-neutral-500"
					>Don't worry, we've <span class="italic">never</span> been compromised
					<div class="relative bottom-1 inline text-xs">*</div>
				</span>
			</div>
		</div>
	</div>
</div>
