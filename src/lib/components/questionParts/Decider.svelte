<script>
	import Checkboxes from './Checkboxes.svelte';
	import RadioButtons from './RadioButtons.svelte';

	let { part = $bindable() } = $props();
</script>

{#if part.type === "checkbox"}
	<Checkboxes bind:part />
{:else if part.type === "radio"}
	<RadioButtons bind:part />
{:else}
	E jebiga
{/if}
