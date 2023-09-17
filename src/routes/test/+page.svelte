<script lang="ts">
	import { runAsync } from '$lib/worker/promise_worker';

	export let numbers: number[] = [];

	async function run() {
		let answer = await runAsync(() => {
			let x = 1;
			for (let i = 0; i < 20; i++) {
				x *= 2;
			}
			return x;
		});
		console.log(answer);
	}
</script>

<main>
	<button on:click={run}>run</button>
	{#if numbers}
		{#each numbers as number}
			<div>{number}</div>
		{/each}
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 2rem;
	}
</style>
