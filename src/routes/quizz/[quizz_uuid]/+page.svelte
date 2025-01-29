<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<section class="grid w-full grid-cols-1 gap-x-4 gap-y-16 md:grid-cols-2 md:place-items-center ">
	<div class="h-full">
		{#if data.quizz}
			<p class="mb-2 text-6xl font-bold">
				{data.quizz.title}
			</p>
			<p class="mb-12 text-neutral-500">A quizz by {data.author.username}</p>
		{/if}

		<div class="flex gap-x-8">
			{#if data.session}
				<form method="post" use:enhance action="?/continue">
					<Button variant="default" type="submit">Continue</Button>
				</form>
			{/if}
			<form method="post" use:enhance action="?/new">
				<Button variant={data.session ? 'ghost' : 'default'} type="submit">Take</Button>
			</form>
		</div>
	</div>
	<div class="w-fit mx-auto">
		<p class="md:w-full text-center text-neutral-500">Past results</p>
		{#if data.past_results}
			{#each data.past_results as past_result}
				<div class="mb-2 grid grid-cols-2 items-center gap-x-2 w-full">
					<span class="w-full text-right text-lg font-bold"
						>{Math.floor((past_result.achieved / past_result.total) * 100)}%</span
					>
					<div
						class=" flex w-fit place-items-center items-center gap-x-1 px-2 py-1 text-center text-neutral-500"
					>
						<span class="w-full text-right text-lg font-bold"
							>{Math.round(past_result.achieved * 100) / 100}</span
						>
						<span class="text-3xl">/</span>
						<span class="w-full text-left text-lg font-bold"
							>{Math.round(past_result.total * 100) / 100}</span
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</section>
