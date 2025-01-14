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

<div>
	<div>
		Session by {data.user.username}
	</div>
	{#each by_question as QnA}
		{QnA.question.question}

		{#each QnA.answers as answer}
			<div>
				<Decider review part={answer.question_part_copy} />
			</div>
		{/each}
	{/each}
</div>
