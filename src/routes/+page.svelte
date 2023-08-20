<script lang="ts">
	import { enhance } from '$app/forms';
	import { selectedImage } from '$lib/stores';
	import type { ActionData } from './$types';

	export let form: ActionData;

	const handleImageChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			$selectedImage = input.files[0];
		}
	};
</script>

<main>
	<h1>Upload Image</h1>
	<form method="POST" enctype="multipart/form-data" use:enhance>
		<input name="image" type="file" accept="image/png" on:change={handleImageChange} required />
		<button type="submit">Submit</button>
	</form>

	{#if $selectedImage}
		<img src={URL.createObjectURL($selectedImage)} alt="Selected" />
	{/if}

	{#if form?.text}
		<div class="string-list">
			{#each form.text as textItem}
				<div class="string-item">{textItem}</div>
			{/each}
		</div>
	{/if}
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
	* {
		font-family: 'Noto Color Emoji', sans-serif;
	}
	main {
		text-align: center;
		padding: 2rem;
	}

	img {
		max-width: 100%;
		margin-top: 1rem;
	}
	.string-list {
		display: flex;
		flex-direction: column;
		font-size: small;
	}
</style>
