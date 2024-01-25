<script lang="ts">
	import '../app.css';

	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
</script>

<div
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex py-1">
		<div class="ml-auto">
			<ThemeSwitch></ThemeSwitch>
		</div>
	</div>
</div>

<slot />
