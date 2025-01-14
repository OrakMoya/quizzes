<script>
	import RadioButtons from './RadioButtons.svelte';
	import Checkboxes from './Checkboxes.svelte';

	let { part = $bindable() } = $props();
</script>

{part.text}
{#if part.type === "checkbox"}
	<Checkboxes bind:part />
{:else if part.type === "radio"}
	<RadioButtons bind:part />
{:else}
	E jebiga
{/if}
