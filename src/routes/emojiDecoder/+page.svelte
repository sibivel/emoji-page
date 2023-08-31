<script lang="ts">
	let emojisText = ''; // State to store the text with emojis
	let unicodeCodes: string[][] = []; // Array to store Unicode codes of emojis

	// Function to extract Unicode codes from emojis
	function extractUnicodeCodes() {
		unicodeCodes = [...emojisText].map((char) => {
			return characterToCodePoints(char);
		});
	}

	function characterToCodePoints(char: string): string[] {
    console.log(char);
		const codePoints = [];

		for (let i = 0; i < char.length; i++) {
			const codePoint = char.charCodeAt(i);
      if (codePoint !== undefined) {
  			codePoints.push(codePoint.toString(16));
      }
		}
    console.log(codePoints);
		return codePoints;
	}
</script>

<main>
	<h1>Emoji Unicode Code Extractor</h1>
	<textarea bind:value={emojisText} rows="5" placeholder="Enter emojis here" />
	<button on:click={extractUnicodeCodes}>Extract Unicode Codes</button>

	<div>
		<h2>Unicode Codes:</h2>
		<ul>
			{#each unicodeCodes as code}
				<li>{code.join('_')}</li>
			{/each}
		</ul>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		text-align: center;
	}

	textarea {
    font-family: sans-serif;
		width: 100%;
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		resize: vertical;
	}

	button {
		padding: 8px 16px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		font-family: sans-serif;
		margin: 5px 0;
	}
</style>
