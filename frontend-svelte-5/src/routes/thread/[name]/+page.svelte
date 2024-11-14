<script>
	import { getThreadById } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import CommentCategory from './CommentCategory.svelte';
	// import ThreadUpvote from "../subComponents/ThreadUpvote.svelte";

	let threadId = $page.params.name;

	let userId = $state('');
	let thread = $state(null);

	onMount(async () => {
		userId = localStorage.getItem('user');
		console.info({ threadId, userId });
		thread = await getThreadById(threadId, userId);
		console.info({ thread });
	});

	let threadInfo = $derived(thread?.threadInfo);
</script>

<div class="left">
	<main>
		{#if thread}
			<h2>{threadInfo?.name}</h2>
			<h3>{threadInfo?.description}</h3>
			<div class="commentFooter">
				<!-- <ThreadUpvote {userId} thread={threadInfo}></ThreadUpvote> -->
			</div>
		{/if}
	</main>

	<div class="commentMain">
		{#if thread}
			<CommentCategory bind:thread {threadId} type={'FOR'} />
			<CommentCategory bind:thread {threadId} type={'AGAINST'} />
		{/if}
	</div>
</div>

<style>
	.left {
		/* Align items to the start of the cross axis (left) */
		width: 900px;
		margin-left: 230px;
		overflow: auto; /* Enable scrolling when necessary */
		height: 670px;
		padding: 0px;
		display: block;
		border: 1px solid black;
	}
	.commentMain {
		display: flex;
		justify-content: space-evenly;
	}
	main {
		text-align: center;
		background-color: #fefffe;
		width: 600px;
		margin: auto;
	}
	.commentFooter {
		height: 20px;
		display: flex;
		align-items: flex-end; /* Vertically center items */
		justify-content: flex-start; /* Align items to the right */
	}
</style>
