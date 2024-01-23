<script lang="ts">
	import * as Dropdown from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { Check, Sun, Moon } from 'lucide-svelte';
	import { browser } from '$app/environment';

	const defaultTheme = 'system';

	const THEMES = ['light', 'dark', 'system'] as const;
	type Theme = (typeof THEMES)[number];

	const themeName: Record<Theme, string> = {
		light: 'Light',
		dark: 'Dark',
		system: 'System'
	};

	let currentTheme: Theme = defaultTheme;

	function selectTheme(theme: 'light' | 'dark' | 'system') {
		currentTheme = theme;
		localStorage.setItem('theme', currentTheme);
	}

	$: browser && document.documentElement.classList.toggle('dark', isDark(currentTheme));

	function handleStorageEvent(event: StorageEvent) {
		if (event.key === 'theme') {
			currentTheme = (event.newValue ?? defaultTheme) as Theme;
		}
	}

	function isDark(theme: Theme) {
		return (
			theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
		);
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
		<Button builders={[builder]} variant="ghost">
			<Moon class="hidden dark:block"></Moon>
			<Sun class="block dark:hidden"></Sun>
		</Button>
	</Dropdown.Trigger>
	<Dropdown.Content class="w-24">
		{#each THEMES as theme}
			<Dropdown.Item on:click={() => selectTheme(theme)} class="relative pl-8">
				{#if currentTheme === theme}
					<Check class="absolute left-1 w-6"></Check>
				{/if}
				{themeName[theme]}
			</Dropdown.Item>
		{/each}
	</Dropdown.Content>
</Dropdown.Root>
