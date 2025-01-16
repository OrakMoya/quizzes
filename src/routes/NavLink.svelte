<script>
	import { MoveRightIcon } from 'lucide-svelte';

	let { href, rel = '', preload_data = '', children, ...rest } = $props();
</script>

<a
	{href}
	data-sveltekit-preload-data={preload_data}
	{rel}
	class="
						group
						flex w-full items-center
						gap-x-2 text-xl text-neutral-500
						transition-all hover:text-white
	{rest.class}
						"
>
	{@render children()}
	<MoveRightIcon
		class="size-5 -translate-x-2 translate-y-[1px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
	/>
</a>
