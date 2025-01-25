<script>
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Accordion from '$lib/components/ui/accordion';

	// your script goes here
</script>

<main class="mx-auto max-w-screen-lg">
	<h1 class="mt-4 text-4xl font-bold">Profile</h1>
	<form class="max-w-[400px]">
		<Label>Username</Label>
		<Input type="text" />
		<Label>E-mail</Label>
		<Input type="email" disabled />
		<Accordion.Root type="single">
			<Accordion.Item value="item-1" class="border-0">
				<Accordion.Trigger>Password</Accordion.Trigger>
				<Accordion.Content>
					<Label>New password</Label>
					<Input type="password" />
					<Label>Confirm new password</Label>
					<Input type="password" />
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</form>
</main>
