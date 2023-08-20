<script lang="ts">
	import type { EmojiInfo } from "$lib/server/emoji_data";

	export let data: { emojis: Array<EmojiInfo> };
</script>

<h1>Emojis</h1>

{#each data.emojis as emoji}
	<li>
		<a href="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/72/{emoji.path}"
			>{emoji.emoji}</a
		>
	</li>
{/each}