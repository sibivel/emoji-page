<script lange="ts">
	import { base } from '$app/paths';
</script>

<link rel="stylesheet" href="{base}/app.css" />
<slot />
<a href="https://github.com/sibivel/emoji-page" class="github-link"
	><img src="{base}/github-icon.png" width="20px" alt="Github" /></a
>

<style>
	.github-link {
		position: fixed;
		bottom: 10px; /* Adjust this value to set the vertical position from the bottom */
		right: 10px; /* Adjust this value to set the horizontal position from the right */
		z-index: 1000; /* Ensure it's above other content */
	}
</style>
