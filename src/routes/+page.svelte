<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ArrowRightIcon, ChevronRightIcon, MoveRight, MoveRightIcon, XIcon } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import NavLink from './NavLink.svelte';
	import { onMount } from 'svelte';

	/** @typedef {Object} Props
	 * @prop {{logged_in: boolean}} data
	 * @prop {any|null} [form]
	 */

	/** @type {Props} */
	let { data, form } = $props();

	let error_state = $state(false);
	let quizz_code = $state('');

	$effect(() => {
		if (form?.incorrect) {
			setTimeout(() => (error_state = true), 1);
			setTimeout(() => (error_state = false), 1000);
		}
	});
</script>

<svelte:head>
	<title>Quizzes</title>
</svelte:head>

<main
	class="min-w-screen h-screen min-h-screen w-screen overflow-clip bg-neutral-900 px-16 text-white"
>
	<div class="mx-auto flex h-full w-full max-w-screen-md">
		<div class="flex h-4/5 w-full flex-col items-center justify-center">
			<span class="mb-10 w-full text-4xl font-bold md:text-6xl">Quizzes</span>
			<div class="w-full">
				<div class="flex w-full flex-col items-start justify-between gap-x-2 gap-y-16 md:flex-row">
					<div class="flex flex-col">
						<form
							class="group mb-2 flex w-fit gap-x-3 rounded-md border border-accent bg-background"
							action="?/take"
							method="post"
							use:enhance
						>
							<Input
								required
								disabled={!data.logged_in}
								class="w-[120px] shrink rounded-r-none border-0 pr-0 text-center 
								delay-60 placeholder:font-normal placeholder:tracking-normal 
								placeholder:text-neutral-500 invalid:font-normal invalid:normal-case
								invalid:tracking-normal valid:enabled:font-bold valid:enabled:uppercase valid:enabled:tracking-[0.4em]
								{error_state ? 'text-red-500' : ''}"
								placeholder="Quizz code..."
								min={5}
								max={5}
								bind:value={quizz_code}
								oninput={() => (quizz_code = quizz_code.substring(0, 5))}
								name="quizz_uuid"
							></Input>
							<button
								disabled={!data.logged_in || quizz_code.length !== 5}
								class="group flex items-center justify-center py-2 pl-2 pr-6 transition-all enabled:hover:text-blue-300 disabled:opacity-50"
								type="submit"
							>
								{#if error_state}
									<div
										class="absolute flex items-center justify-center"
										transition:fade={{ duration: 50 }}
									>
										<XIcon class="absolute text-red-500" />
									</div>
								{:else}
									<div
										transition:fade={{ duration: 50 }}
										class="absolute flex items-center justify-center"
									>
										<ChevronRightIcon
											class="absolute size-6 opacity-0 transition-all group-hover:-translate-x-[8px] group-enabled:group-hover:opacity-100"
										/>
										<ChevronRightIcon
											class="absolute size-6 opacity-25 transition-all group-enabled:group-hover:opacity-100"
										/>
										<ChevronRightIcon
											class="absolute size-6 opacity-0 transition-all group-hover:translate-x-[8px] group-enabled:group-hover:opacity-100"
										/>
									</div>
								{/if}
							</button>
						</form>
						{#if !data.logged_in}
							<span class="text-neutral-600">You need to be logged in to take a quizz</span>
						{/if}
					</div>
					<div class="flex w-fit min-w-[100px] flex-col items-center justify-center gap-y-4">
						{#if data.logged_in}
							<NavLink href="/dashboard">Dashboard</NavLink>
							<NavLink href="/dashboard/profile">Profile</NavLink>
							<NavLink rel="external" preload_data="off" href="/logout">Log out</NavLink>
						{:else}
							<NavLink href="/login">Log in</NavLink>
							<NavLink href="/register">Sign up</NavLink>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
