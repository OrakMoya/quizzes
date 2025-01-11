<script>
	import Checkboxes from './Checkboxes.svelte';

	let { part = $bindable() } = $props();
</script>

{#if part.type === "checkbox"}
	<Checkboxes bind:part />
{:else}
	E jebiga
{/if}
