<script>
	import RadioButtons from './RadioButtons.svelte';
	import Checkboxes from './Checkboxes.svelte';

	let { part = $bindable(), review = false} = $props();
</script>

{part.text}
{#if part.type === 'checkbox'}
	<Checkboxes bind:part {review} />
{:else if part.type === 'radio'}
	<RadioButtons bind:part {review} />
{:else}
	E jebiga
{/if}
