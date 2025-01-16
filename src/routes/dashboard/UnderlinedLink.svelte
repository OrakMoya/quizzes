<script>
	import { page } from '$app/state';

	let { href, preload = '', children, ...rest } = $props();
	let current = $derived(page.url.pathname == href);
</script>

<a
	{href}
	data-sveltekit-preload-data={preload}
	data-current={current}
	class="data group flex flex-col text-xl data-[current=true]:font-semibold {rest.class} transition-all duration-100"
>
	{@render children()}
	<div
		class=" h-[2px] w-0 rounded-full bg-blue-500 transition-all
		group-hover:w-full
		group-data-[current=true]:w-full"
	></div>
</a>
