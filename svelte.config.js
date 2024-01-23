import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import MagicString from 'magic-string';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [lucideSvelteImportOptimizer(), vitePreprocess({})],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;

/**
 * @return {import('svelte/compiler').PreprocessorGroup}
 */
function lucideSvelteImportOptimizer() {
	return {
		name: 'lucide-svelte optimizer',
		script({ content, filename }) {
			const ms = new MagicString(content, { filename });

			ms.replace(
				/([ \t]*)import\s+\{(.*?)\}\s+from\s+['"]lucide-svelte['"];?/g,
				(match, whitespace, importNames) => {
					const hasSemi = match.endsWith(';');

					const imports = importNames
						.split(',')
						.map((v) => v.trim())
						.map((name) => {
							const path = name
								.split('')
								.map((c, i) => {
									const code = c.charCodeAt(0);
									return code >= 65 && code <= 90 ? (i === 0 ? '' : '-') + c.toLowerCase() : c;
								})
								.join('');

							return `${whitespace}import ${name} from 'lucide-svelte/icons/${path}'${hasSemi ? ';' : ''}`;
						});

					return imports.join('\n');
				}
			);

			if (ms.hasChanged()) {
				return {
					code: ms.toString(),
					map: ms.generateMap()
				};
			}
		}
	};
}
