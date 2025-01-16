<script>
	import RadioButtons from './RadioButtons.svelte';
	import Checkboxes from './Checkboxes.svelte';

	let { part = $bindable(), review = false } = $props();
</script>

<p data-review={review} class="text-lg hidden data-[review=true]:block mb-1">
	{part.text}
</p>
{#if part.type === 'checkbox'}
	<Checkboxes bind:part {review} />
{:else if part.type === 'radio'}
	<RadioButtons bind:part {review} />
{:else}
	E jebiga
{/if}
