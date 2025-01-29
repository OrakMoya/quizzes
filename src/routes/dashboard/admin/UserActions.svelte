<script>
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	let { user = $bindable(), current = false, currentUserRole = '' } = $props();
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { EllipsisVertical } from 'lucide-svelte';

	/**
	 * @type {HTMLFormElement}
	 */
	let changeOwnerForm;
	/**
	 * @type {HTMLFormElement}
	 */
	let deleteUserForm;

	let deleteUserDialogOpen = $state(false),
		changeOwnerDialogOpen = $state(false);
</script>

<AlertDialog.Root bind:open={deleteUserDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>Deleting a user cannot be undone.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form
				bind:this={deleteUserForm}
				onsubmit={() => (deleteUserDialogOpen = false)}
				method="post"
				action="?/delete"
				use:enhance
			>
				<input type="hidden" value={user.uuid} name="user_uuid" />
				<AlertDialog.Action type="submit" class={buttonVariants({ variant: 'destructive' })}
					>Delete</AlertDialog.Action
				>
			</form>
			<AlertDialog.Cancel>No</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={changeOwnerDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>You will no longer be the app owner.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form
				bind:this={changeOwnerForm}
				method="post"
				action="?/changeOwner"
				use:enhance
				onsubmit={(changeOwnerDialogOpen = false)}
			>
				<input type="hidden" value={user.uuid} name="user_uuid" />
				<AlertDialog.Action type="submit">Yes</AlertDialog.Action>
			</form>
			<AlertDialog.Cancel>No</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}
		><EllipsisVertical /></DropdownMenu.Trigger
	>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				onclick={() => (changeOwnerDialogOpen = true)}
				disabled={user.role == 'owner' || currentUserRole !== 'owner'}>Promote to owner</DropdownMenu.Item
			>
			<DropdownMenu.Item>Change password</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={() => (deleteUserDialogOpen = true)}
				disabled={user.role == 'owner'}>Delete</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
