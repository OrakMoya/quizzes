<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import {
		CopyCheckIcon,
		CopyIcon,
		ListChecksIcon,
		PencilIcon,
		PlusIcon,
		TrashIcon
	} from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { uuid } from 'drizzle-orm/pg-core';

	let { data, form } = $props();

	let new_quizz_dialog_open = $state(false);
	let delete_dialogs_open = $state(new Array(data.quizzes.length).fill(false));

	$effect(() => {
		if (form?.success) {
			delete_dialogs_open.fill(false);
		}
	});

	let recentlyCopiedUUID = $state('');
</script>

<svelte:head>
	<title>Your quizzes - Quizzes</title>
</svelte:head>

<div class="mx-auto max-w-screen-lg">
	<Dialog.Root bind:open={new_quizz_dialog_open}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-full" {...props}>
					<PlusIcon />
				</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content>
			<form class="flex flex-col gap-y-4" method="post" action="?/createQuizz" use:enhance>
				<Dialog.Header>
					<Dialog.Title>Create a quizz</Dialog.Title>
				</Dialog.Header>
				<Input placeholder="Quiz name" name="name" />
				<Dialog.Footer>
					<Button onclick={() => (new_quizz_dialog_open = false)} variant="outline">Cancel</Button>
					<Button type="submit">Create</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>

<div class="mx-auto mt-4 grid max-w-screen-lg grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
	{#each data.quizzes as quizz, i}
		<div class="flex min-h-52 justify-between rounded-md border border-accent bg-background p-4">
			<div>
				<p class=" text-2xl font-bold mb-4">{quizz.title}</p>
				<p class="text-sm text-neutral-500">Created: {quizz.created_at?.toLocaleDateString()}</p>
				<p class="text-sm text-neutral-500">Updated: {quizz.updated_at?.toLocaleDateString()}</p>
			</div>
			<div class="flex flex-col gap-y-2">
				<Button
					onclick={() => {
						recentlyCopiedUUID = quizz.uuid;
						navigator.clipboard.writeText(quizz.uuid.substring(0, 5));
						setTimeout(() => (recentlyCopiedUUID = ''), 2000);
					}}
					variant="outline"
				>
					<CopyIcon class="absolute" />
					<CopyCheckIcon
						data-visible={recentlyCopiedUUID === quizz.uuid}
						class="absolute opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100"
					/>
				</Button>
				<a href={'quizzes/edit/' + quizz.uuid}>
					<Button variant="outline">
						<ListChecksIcon />
					</Button>
				</a>
				<a
					class="block"
					href={'quizzes/edit/' +
						quizz.uuid +
						(quizz.first_question ? '/question/' + quizz.first_question.uuid : '')}
				>
					<Button variant="outline">
						<PencilIcon />
					</Button>
				</a>

				<AlertDialog.Root bind:open={delete_dialogs_open[i]}>
					<AlertDialog.Trigger>
						{#snippet child({ props })}
							<Button
								variant="outline"
								{...props}
								onclick={() => (delete_dialogs_open[i] = true)}
								class="
										border-red-500/30 text-red-500
										hover:border-red-500/0 hover:bg-red-500/30 hover:text-red-500
										"
							>
								<TrashIcon />
							</Button>
						{/snippet}
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you sure?</AlertDialog.Title>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<form method="post" action="?/deleteQuizz" use:enhance>
								<input type="hidden" name="quizz_uuid" value={quizz.uuid} />
								<Button type="submit" variant="destructive">Delete</Button>
							</form>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</div>
	{/each}
</div>
