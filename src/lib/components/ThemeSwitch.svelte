<script lang="ts">
	import * as Dropdown from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { Check } from 'lucide-svelte';

	type Theme = 'light' | 'dark' | 'system';
	const defaultTheme = 'system';

	let currentTheme: Theme = defaultTheme;

	function selectTheme(theme: 'light' | 'dark' | 'system') {
		currentTheme = theme;
		localStorage.setItem('theme', currentTheme);

		document.documentElement.classList.toggle('dark');
	}

	function handleStorageEvent(event: StorageEvent) {
		if (event.key === 'theme') {
			currentTheme = (event.newValue ?? defaultTheme) as Theme;
		}
	}

	onMount(() => {
		currentTheme = (localStorage.getItem('theme') ?? defaultTheme) as Theme;

		window.addEventListener('storage', handleStorageEvent);
		return () => {
			window.addEventListener('storage', handleStorageEvent);
		};
	});
</script>

<Dropdown.Root>
	<Dropdown.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline">Open</Button>
	</Dropdown.Trigger>
	<Dropdown.Content class="w-24">
		<Dropdown.Item on:click={() => selectTheme('light')}>
			<Check class="hidden"></Check>
			Light
		</Dropdown.Item>
		<Dropdown.Item on:click={() => selectTheme('dark')}>Dark</Dropdown.Item>
		<Dropdown.Item on:click={() => selectTheme('system')}>System</Dropdown.Item>
	</Dropdown.Content>
</Dropdown.Root>
