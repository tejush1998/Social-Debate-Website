<script>
	import { CaretUpOutline, CaretUpSolid } from 'flowbite-svelte-icons';
	import { upvoteThread, downvoteThread } from '$lib/api.js';

	let { userId, thread } = $props();

	let upvoteToggler = $state(thread.upvoteByUser);

	const toggleUpvote = async (threadId, userId) => {
		if (upvoteToggler === false) {
			const res = await upvoteThread(threadId, userId);
			thread.upvote = res.thread.upvote;
			upvoteToggler = true;
		} else if (upvoteToggler === true) {
			const res = await downvoteThread(threadId, userId);
			thread.upvote = res.thread.upvote;
			upvoteToggler = false;
		}
	};
</script>

<button onclick={() => toggleUpvote(thread.name, userId)}>
	{#if upvoteToggler}
		<CaretUpSolid></CaretUpSolid>
	{:else}
		<CaretUpOutline></CaretUpOutline>
	{/if}

	<!-- <div id="angleUp"></div> -->
</button>
<h4>{thread.upvote}</h4>

<style>
	button {
		background-color: transparent;
		border-color: transparent;
		padding: 0;
		margin: 0;
		width: 20px;
		height: 17px;
		margin-right: 10px;
	}
	h4 {
		margin: 0;
		padding: 0;
	}
</style>
