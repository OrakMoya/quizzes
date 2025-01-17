<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<section class="grid grid-cols-2 place-items-center">
	<div class="">
		{#if data.quizz}
			<p class="mb-1 text-neutral-500">{data.quizz.updated_at?.toLocaleDateString()}</p>
			<p class="mb-12 text-6xl font-bold">
				{data.quizz.title}
			</p>
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
	<div>
		<span class="text-neutral-500">Past results</span>
		{#if data.past_results}
			{#each data.past_results as past_result}
				<div class="flex gap-x-2 items-center">
					<span class="font-bold text-lg">{past_result.achieved}</span>
					<span class="text-3xl">/</span>
					<span class="font-bold text-lg">{past_result.total}</span>
				</div>
			{/each}
		{/if}
	</div>
</section>
