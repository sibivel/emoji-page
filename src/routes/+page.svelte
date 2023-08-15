<script lang="ts">
	let selectedImage: File | null = null;

	const handleImageChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			selectedImage = input.files[0];
		}
	};
</script>

<main>
	<h1>Upload Image</h1>
	<form method="POST" enctype="multipart/form-data">
		<input name="image" type="file" accept="image/png" on:change={handleImageChange} required/>
		<button type="submit">Submit</button>
	</form>

	{#if selectedImage}
		<img src={URL.createObjectURL(selectedImage)} alt="Selected" />
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
</style>
