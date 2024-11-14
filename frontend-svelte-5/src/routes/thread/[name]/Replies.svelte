<!-- CommentCategory.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import { AngleUpOutline } from 'flowbite-svelte-icons';
	import Upvote from '$lib/Upvote.svelte';
	import { onMount } from 'svelte';

	let { commentName, commentObject = $bindable() } = $props();
	let userId = $state('');

	onMount(async () => {
		userId = localStorage.getItem('user');
	});
</script>

<div class="commentBlock" transition:slide={{ delay: 0, duration: 200 }}>
	{#each commentObject[commentName] as replies}
		<div class="replies">
			<h4>{replies.issuer.name}</h4>
			<div class="something">{replies.comment.content}</div>

			<div id="upvoteComp">
				<Upvote {userId} comment={replies.comment}></Upvote>
			</div>
		</div>
	{/each}
</div>

<style>
	.replies {
		width: 150px;
		margin-top: 10px;
		margin-left: 40px;
	}
	.commentBlock {
		width: 240px;
	}
	h4 {
		margin: 0;
		padding: 0;
		background-color: white;
	}
	#upvoteComp {
		margin-left: 10px;
		display: flex;
		align-items: flex-end; /* Vertically center items */
		justify-content: flex-start; /* Align items to the right */
	}
	.something {
		padding-left: 40px;
		padding-top: 5px;
		background-color: white;
		padding-bottom: 5px;
	}
</style>
