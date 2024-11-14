<script>
	import { CaretUpOutline, CaretUpSolid } from 'flowbite-svelte-icons';
	import { upvoteComment, downvoteComment } from '$lib/api';

	let { userId, comment } = $props();

	console.info({ comment: comment.upvoteByUser });
	let upvoteToggler = $state(comment.upvoteByUser);

	const toggleUpvote = async (commentId, userId) => {
		console.info('toggleUpvote', upvoteToggler);
		if (upvoteToggler === false) {
			const res = await upvoteComment(commentId, userId);
			comment.upvote = res.comment.upvote;
			upvoteToggler = true;
		} else if (upvoteToggler === true) {
			const res = await downvoteComment(commentId, userId);
			comment.upvote = res.comment.upvote;
			upvoteToggler = false;
		}
	};
</script>

<button onclick={() => toggleUpvote(comment.name, userId)}>
	{#if upvoteToggler}
		<CaretUpSolid></CaretUpSolid>
	{:else}
		<CaretUpOutline></CaretUpOutline>
	{/if}

	<!-- <div id="angleUp"></div> -->
</button>
<h4>{comment.upvote}</h4>

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
