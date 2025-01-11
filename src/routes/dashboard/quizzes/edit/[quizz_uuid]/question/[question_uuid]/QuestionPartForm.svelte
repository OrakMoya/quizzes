<script>
	import Decider from '$lib/components/questionParts/Decider.svelte';
	import { Input } from '$lib/components/ui/input';

	let { part = $bindable() } = $props();
	$effect(() => {
		$inspect(part);
	});
</script>

<Input type="text" bind:value={part.type} oninput={() => (part.data = [])} />
<Input type="text" bind:value={part.text} />
<Input type="number" bind:value={part.carries} placeholder="Carries" />
<Input type="number" bind:value={part.wrong_carries} placeholder="Wrong carries" />
<Decider bind:part />
