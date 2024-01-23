<script lang="ts">
	import { writable } from 'svelte/store';
	import { addDays, eachDayOfInterval, format } from 'date-fns';
	import DateRangePicker from './DateRangePicker.svelte';
	import type { DateRange } from 'bits-ui';
	import { today } from '@internationalized/date';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';

	interface UserConfig {
		name: string;
		role: string;
		availability: number[];
	}

	const users = writable<UserConfig[]>([
		{ name: 'One', role: 'Frontend', availability: new Array(15).fill(0) },
		{ name: 'Two', role: 'Frontend', availability: new Array(15).fill(0) },
		{ name: 'Three', role: 'Frontend', availability: new Array(15).fill(0) }
	]);
	const roles = writable<string[]>(['Frontend', 'Backend']);

	let velocity = 1;

	let dateRange = {
		start: today('UTC'),
		end: today('UTC').add({ days: 14 })
	} satisfies DateRange;

	$: days = eachDayOfInterval({
		start: dateRange.start?.toDate('UTC'),
		end: dateRange.end?.toDate('UTC')
	});

	function getWorkdaysForRole(users: UserConfig[], role: string) {
		return users.reduce((sum, u) => (u.role === role ? sum + sumArray(u.availability) : sum), 0);
	}

	function sumArray(n: number[]) {
		let res = 0;
		for (const v of n) {
			res += v;
		}
		return res;
	}

	let start: { x: number; y: number } = { x: -1, y: -1 };
	let end: { x: number; y: number } = { x: -1, y: -1 };

	function handleSelect(end: { x: number; y: number }) {
		console.log(start, end);
	}

	$: isIn = (x: number, y: number) => {
		return x >= start.x && x <= end.x && y >= start.y && y <= end.y;
	};
</script>

<div class="container py-16">
	<div class="my-4 flex gap-4">
		<DateRangePicker bind:value={dateRange}></DateRangePicker>

		<div class="flex items-center gap-4">
			<Label for="velocity">Velocity</Label>
			<Input id="velocity" class="w-20 text-center" type="number" bind:value={velocity} />
		</div>
	</div>

	<table class="w-full whitespace-nowrap">
		<thead class="text-sm font-medium text-muted-foreground [&_th]:border [&_th]:p-2">
			<tr>
				<th>User</th>
				<th>Role</th>

				{#each days as day}
					<th class="bg-muted/25">
						<div class="flex flex-col items-center">
							<span>{format(day, 'EEEEEE')}</span>
							<span class="text-xs text-muted-foreground text-opacity-50">
								{format(day, 'dd.MM')}
							</span>
						</div>
					</th>
				{/each}

				<th>Days this sprint</th>
				<th>Capacity</th>
			</tr>
		</thead>

		<tbody class="[&_td]:border [&_td]:p-2">
			{#each $users as user, y}
				<tr>
					<td class="font-medium">{user.name}</td>
					<td></td>

					{#each user.availability as a, x}
						<td
							class="bg-muted/25"
							class:bg-red-500={isIn(x, y)}
							on:pointerdown|preventDefault={() => {
								start = { x, y };
							}}
							on:pointerenter={() => {
								end = { x, y };
							}}
							on:pointerup={() => handleSelect({ x, y })}>{a}</td
						>
					{/each}

					<td></td>
					<td></td>
				</tr>
			{/each}
		</tbody>
	</table>

	<hr class="my-16" />

	<h2 class="mb-8 text-xl">Results:</h2>

	<table>
		<thead>
			<tr>
				<th>Total workdays</th>
				{#each $roles as role}
					<th>{role}</th>
				{/each}
			</tr>
		</thead>
		<tbody class="[&_td]:border [&_td]:p-2">
			{#each $roles as role}
				<tr>
					<td>{role}:</td>
					<td>{0}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				{#each $roles as role}
					<Table.Head>{role} workdays</Table.Head>
				{/each}

				<Table.Head class="w-[100px]">Total workdays</Table.Head>
				<Table.Head class="text-right">Total capacity</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				{#each $roles as role}
					<Table.Cell>{getWorkdaysForRole($users, role)}</Table.Cell>
				{/each}

				<Table.Cell class="font-medium">INV001</Table.Cell>
				<Table.Cell>Paid</Table.Cell>
				<Table.Cell>Credit Card</Table.Cell>
				<Table.Cell class="text-right">$250.00</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</div>
