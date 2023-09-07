<script lang="ts">
	import { enhance } from '$app/forms';
	import { findClosestEmoji, getAverageColorsGrid } from '$lib/client/process_images';
	import { selectedImage } from '$lib/stores';
	import avgColorsObj from '$lib/downloaded/emojiAvgColors.json';
	export let emojis: string[];
	let uploadedImage: HTMLImageElement;

	const handleImageChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			$selectedImage = input.files[0];
		}
	};

	async function imageSubmit(e: SubmitEvent) {
		e.preventDefault();
		const pixels = await getAverageColorsGrid(uploadedImage);
		emojis = pixels.map((row) =>
			row.map((pixel) => findClosestEmoji(pixel, new Map(Object.entries(avgColorsObj)))).join('')
		);
	}
</script>

<main>
	<h1>Upload Image</h1>
	<form on:submit={imageSubmit} enctype="multipart/form-data" use:enhance>
		<input name="image" type="file" accept="image" on:change={handleImageChange} required />
		<button type="submit">Submit</button>
	</form>

	{#if $selectedImage}
		<img src={URL.createObjectURL($selectedImage)} alt="Selected" bind:this={uploadedImage} />
	{/if}

	{#if emojis}
		<div class="string-list">
			{#each emojis as textItem}
				<div class="string-item">{textItem}</div>
			{/each}
		</div>
	{/if}
</main>

<style>
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
