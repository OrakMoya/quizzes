<script>
	import Decider from '$lib/components/questionPartsQuizz/Decider.svelte';

	let { data } = $props();
	let answers = $derived(data.answers);
	let by_question = $derived.by(() => {
		/**
		 * @type {any[]}
		 */
		let questions = [];
		answers.forEach((/** @type {any} */ ans, i) => {
			questions.find((q) => q.uuid === ans.question_copy.uuid)
				? 0
				: questions.push(ans.question_copy);
			ans.question_part_copy.answer_data = ans.answers;
		});

		return [
			...questions.map((q) => ({
				question: q,
				answers: [...answers.filter((ans) => ans.question_copy.uuid === q.uuid)]
			}))
		];
	});
</script>

<svelte:head>
	<title>
		{data.user?.username ?? '[deleted]'}'s session - Quizzes
	</title>
</svelte:head>

<div>
	<div class="mb-2 mt-4 text-neutral-500">
		Session by {data.user?.username ?? '[deleted]'}
	</div>
	<div class="w-full">
		{#each by_question as QnA, i}
			<div class="mb-4 pb-8 pt-6">
				<p class="mb-2 text-2xl font-bold">
					{QnA.question.position}: {QnA.question.question}
				</p>

				<div class="grid grid-cols-3 gap-x-4">
					{#each QnA.answers as answer}
						<div>
							<Decider review part={answer.question_part_copy} />
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
