<script>
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Dialog from '$lib/components/ui/dialog';
	let { user = $bindable(), current = false, currentUserRole = '' } = $props();
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { EllipsisVertical } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { page } from '$app/state';

	/**
	 * @type {HTMLFormElement}
	 */
	let changeOwnerForm;
	/**
	 * @type {HTMLFormElement}
	 */
	let changePasswordForm;
	/**
	 * @type {HTMLFormElement}
	 */
	let deleteUserForm;

	let deleteUserDialogOpen = $state(false),
		changeOwnerDialogOpen = $state(false),
		changePasswordDialog1Open = $state(false),
		changePasswordDialog2Open = $state(false);

	let newPassword = $state(''),
		newPasswordConfirmation = $state(''),
		adminPassword = $state('');

	function resetPasswordDialogs() {
		newPassword = '';
		newPasswordConfirmation = '';
		adminPassword = '';
		changePasswordDialog1Open = false;
		changePasswordDialog2Open = false;
	}

	$effect(() => {
		page.form;
		setTimeout(() => {
			if (page.form?.success) {
				resetPasswordDialogs();
			}
		});
	});
</script>

<form bind:this={changePasswordForm} class="hidden" method="post" action="?/changePassword" use:enhance>
	<input required type="hidden" name="user_uuid" value={user.uuid} />
	<input required type="hidden" name="new_password" bind:value={newPassword} />
	<input
		required
		type="hidden"
		name="new_password_confirmation"
		bind:value={newPasswordConfirmation}
	/>
	<input required type="hidden" name="admin_password" bind:value={adminPassword} />
</form>

<Dialog.Root bind:open={changePasswordDialog1Open}>
	<Dialog.Content>
		<form
			class="group flex flex-col gap-y-2"
			onsubmit={(e) => {
				e.preventDefault();
				changePasswordDialog1Open = false;
				changePasswordDialog2Open = true;
			}}
		>
			<Dialog.Header>
				<Dialog.Title>Change password for user {user.username}</Dialog.Title>
			</Dialog.Header>
			<Input
				type="password"
				required
				placeholder="New password"
				autocomplete="new-password"
				bind:value={newPassword}
			/>
			<Input
				required
				type="password"
				placeholder="Confirm new password"
				autocomplete="new-password"
				bind:value={newPasswordConfirmation}
			/>
			<Dialog.Footer>
				<Button
					disabled={newPassword !== newPasswordConfirmation ||
						!newPassword ||
						!newPasswordConfirmation}
					type="submit">Save</Button
				>
				<Button variant="outline" onclick={resetPasswordDialogs}>Cancel</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
<Dialog.Root bind:open={changePasswordDialog2Open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>This action requires authentication</Dialog.Title>
		</Dialog.Header>
		<div>
			<Input type="password" placeholder="Your admin password" bind:value={adminPassword} />
			{#if page.form?.admin_password_incorrect}
				<span class="text-sm text-neutral-500">Incorrect password</span>
			{/if}
		</div>
		<Dialog.Footer>
			<Button
				onclick={() => {
					changePasswordForm.requestSubmit();
				}}>Save</Button
			>
			<Button variant="outline" onclick={resetPasswordDialogs}>Cancel</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

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
				disabled={user.role == 'owner' || currentUserRole !== 'owner'}
				>Promote to owner</DropdownMenu.Item
			>
			<DropdownMenu.Item
				disabled={user.role === 'owner'}
				onclick={() => (changePasswordDialog1Open = true)}>Change password</DropdownMenu.Item
			>
			<DropdownMenu.Item
				onclick={() => (deleteUserDialogOpen = true)}
				disabled={user.role == 'owner'}>Delete</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
