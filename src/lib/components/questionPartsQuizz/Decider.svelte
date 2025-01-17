<script>
	import RadioButtons from './RadioButtons.svelte';
	import Checkboxes from './Checkboxes.svelte';

	let { part = $bindable(), review = false } = $props();
</script>

<p
	data-review={review}
	data-darken={part.text.length ? false : true}
	class="mb-1 text-lg data-[darken=true]:data-[review=false]:hidden data-[darken=true]:text-neutral-500 data-[review=true]:block"
>
	{#if part.text.length}
		{part.text}
	{:else}
		No text...
	{/if}
</p>
{#if part.type === 'checkbox'}
	<Checkboxes bind:part {review} />
{:else if part.type === 'radio'}
	<RadioButtons bind:part {review} />
{:else}
	E jebiga
{/if}
