<script>
	import { getCommentOfUser } from '$lib/api.js';
	import { onMount } from 'svelte';
	import Upvote from '$lib/Upvote.svelte';

	let name = $state([]);
	let userId = $state('');

	onMount(async () => {
		userId = localStorage.getItem('user');
		name = await getCommentOfUser(userId);
	});
</script>

<div class="left">
	{#each name as cat}
		<main>
			<h2>{cat.comment.name}</h2>
			<h3>{cat.comment.content}</h3>
			<div class="commentFooter">
				<Upvote {userId} comment={cat.comment}></Upvote>
				<div class="commentFooter"></div>
			</div>
		</main>
	{/each}
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
