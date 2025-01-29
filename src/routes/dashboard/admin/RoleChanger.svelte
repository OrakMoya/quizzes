<script>
	import { enhance } from '$app/forms';
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import AlertDialogOverlay from '$lib/components/ui/alert-dialog/alert-dialog-overlay.svelte';

	let { user = $bindable(), current = false } = $props();
	let selectedRole = $state(user.role);
	/**
	 * @type {HTMLFormElement}
	 */
	let form;
	let alertDialogOpen = $state(false);

	let options = [
		{
			value: 'user',
			label: 'User'
		},
		{
			value: 'admin',
			label: 'Admin'
		}
	];

	function handleRoleChange() {
		if (current) {
			alertDialogOpen = true;
			return;
		}
		setTimeout(() => form.requestSubmit());
	}

	$effect(() => {
		selectedRole = user.role;
	});
</script>

<AlertDialog.Root bind:open={alertDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>You will lose access to admin features.</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			<AlertDialog.Action onclick={() => form.requestSubmit()}>Change my role</AlertDialog.Action>
			<AlertDialog.Cancel
				onclick={() => {
					alertDialogOpen = false;
					selectedRole = user.role;
				}}>Cancel</AlertDialog.Cancel
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<form bind:this={form} method="post" action="?/changeRole" use:enhance>
	<input type="hidden" value={user.uuid} name="user_uuid" />
	<input type="hidden" bind:value={selectedRole} name="new_role" />
</form>

<Combobox class="w-[120px]" onChange={handleRoleChange} bind:value={selectedRole} {options} />
