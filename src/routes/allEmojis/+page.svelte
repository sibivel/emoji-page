<script lang="ts">
	import emojis from '$lib/downloaded/emojis.json';
</script>

<h1>Emojis</h1>

{#each emojis as emoji}
	<div>
		<a href="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/72/{emoji.path}"
			>{emoji.emoji}</a
		>
	</div>
{/each}
