<script lang="ts">
	import {
		euclideanDistance,
		findClosestEmoji,
		getAverageColorsGrid,
		pixelToColorVector
	} from '$lib/client/process_images';
	import { selectedImageAddress } from '$lib/stores';
	import avgColorsObj from '$lib/downloaded/emojiAvgColors.json';
	import defaultImage from '$lib/test.png';
	import { time, timeSync } from '$lib/util';
	import { kdTree } from 'kd-tree-javascript';

	export let emojis: string[];
	let uploadedImage: HTMLImageElement;
	let width = 70; // Default value

	$selectedImageAddress = defaultImage;

	const handleImageChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			$selectedImageAddress = URL.createObjectURL(input.files[0]);
		}
	};

	const vectors = Object.entries(avgColorsObj).map(([emoji, color]) =>
		pixelToColorVector(color, emoji)
	);
	const tree = new kdTree(vectors, (vector1, vector2) => euclideanDistance(vector1, vector2), [
		'name',
		'r',
		'g',
		'b',
		'a'
	]);

	async function imageSubmit(e?: SubmitEvent) {
		if (e) {
			e.preventDefault();
		}
		await time('total-process', async () => {
			const pixels = await time('image-process', () => getAverageColorsGrid(uploadedImage, width));
			emojis = [];
			timeSync('find-closest-emojis', () =>
				pixels.forEach((row) => {
					emojis.push(row.map((pixel) => findClosestEmoji(pixel, tree)).join(''));
				})
			);
		});
	}
</script>

<main>
	<h1>Convert Image to Emojis</h1>
	<p>Select an image to convert it to text using emojis</p>
	<form on:submit={imageSubmit} enctype="multipart/form-data">
		<input name="image" type="file" accept="image" on:change={handleImageChange} />
		<label for="slider">Output size:</label>
		<input
			type="range"
			id="slider"
			name="slider"
			min="1"
			max="200"
			step="1"
			bind:value={width}
			on:change={() => imageSubmit()}
		/>
		<span>{width}</span>
		<button type="submit">Convert To Emoji</button>
	</form>

	{#if $selectedImageAddress}
		<img src={$selectedImageAddress} alt="Selected" bind:this={uploadedImage} width="500px" />
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
		font-size: x-small;
	}
</style>
