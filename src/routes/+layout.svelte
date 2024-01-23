<script lang="ts">
	import '../app.css';

	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
</script>

<div class="sticky top-0 bg-background backdrop-blur">
	<div class="container flex py-1">
		<div class="ml-auto">
			<ThemeSwitch></ThemeSwitch>
		</div>
	</div>
</div>

<slot />
