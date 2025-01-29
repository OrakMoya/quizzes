<script>
	import { page } from '$app/state';

	let { href, rel='', preload = '', children, ...rest } = $props();
	let current = $derived(page.url.pathname == href);
</script>

<a
	{href}
	data-sveltekit-preload-data={preload}
	data-current={current}
	{rel}
	class="data group w-fit flex flex-col text-base data-[current=true]:font-semibold sm:text-lg md:text-xl {rest.class} transition-all duration-100"
>
	{@render children()}
	<div
		class=" h-[2px] w-0 rounded-full bg-blue-500 transition-all
		group-hover:w-full
		group-data-[current=true]:w-full"
	></div>
</a>
