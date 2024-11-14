<script>
	import { getThreadsOfUser } from '$lib/api.js';
	import { onMount } from 'svelte';
	import ThreadUpvote from '$lib/ThreadUpvote.svelte';

	let userId = $state('');
	let name = $state([]);

	onMount(async () => {
		userId = localStorage.getItem('user');
		name = await getThreadsOfUser(userId);
		console.info({ name, userId });
	});
</script>

<div class="left">
	{#if name}
		{#each name as cat}
			<a href="../thread/{cat.name}">
				<main>
					<h2>{cat.name}</h2>
					<h3>{cat.description}</h3>
					<div class="commentFooter">
						<ThreadUpvote {userId} thread={cat}></ThreadUpvote>
					</div>
				</main>
			</a>
		{/each}
	{/if}
</div>

<style>
	main {
		text-align: center;
		background-color: #fefffe;
		color: black;
	}
	h2,
	h3 {
		color: black;
	}
	.left {
		display: inline-block;
		width: 640px;
		margin-left: 230px;
		overflow: auto; /* Enable scrolling when necessary */
		height: 500px;
		padding: 0px;
	}

	.commentFooter {
		height: 20px;
		display: flex;
		align-items: flex-end; /* Vertically center items */
		justify-content: flex-start; /* Align items to the right */
	}
</style>
