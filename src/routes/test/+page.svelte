<script lang="ts">
  export let numbers: number[] = [];

  async function  run() {
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100000000; j++) {}
      // await new Promise((resolve) => setTimeout(() => resolve('timeout'), 1000))
      numbers.push(i);
      numbers = numbers;
    }
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
