<script>
	import { getReplyToComment, postReplyToComment } from '$lib/api.js';
	import { CirclePlusOutline, CirclePlusSolid, AnnotationSolid } from 'flowbite-svelte-icons';
	import Replies from "./Replies.svelte";
	import { onMount } from 'svelte';
	import Reply from '$lib/Reply.svelte';
	import Upvote from '$lib/Upvote.svelte';

	let { commentArray } = $props();

	console.info({ commentArray });
	let commentObject = $state({});
	let toggler = $state({});
	let replyToggler = $state({});
	let reply = $state('');
	let userId = $state('');

	onMount(async () => {
		userId = localStorage.getItem('user');
	});

	const toggleComment = async (commentId) => {
		if (!commentObject[[commentId]]) {
			let res = await getReplyToComment(commentId, userId);
			commentObject[commentId] = res;
		}
		toggler[commentId] = !toggler[commentId];
	};
	const postReply = async (commentId, reply) => {
		await postReplyToComment(commentId, reply, userId);
		// commentObject[commentId].totalReplies + =1
		let res = await getReplyToComment(commentId, userId);
		const comment = commentArray.find((c) => c.name === commentId);
		if (comment) {
			comment.totalReplies = res.length; // Update totalReplies based on new data
		}

		commentObject[commentId] = res;
	};
	const togglerSwitch = (comment) => {
		replyToggler[comment.name] = !replyToggler[comment.name];
	};
</script>

{#if commentArray}
	{#each commentArray as comment}
		<div class="wholeBlock">
			<div class="subComment">
				<h4>{comment.userName}</h4>
				<div class="something">{comment.content}</div>

				<div class="commentFooter">
					<button id="toggler" onclick={() => toggleComment(comment.name)}>
						{#if comment.totalReplies > 0}
							<CirclePlusSolid />
						{:else}
							<CirclePlusOutline />
						{/if}
					</button>
					<Upvote {userId} {comment}></Upvote>
					<button
						id="post"
						type="submit"
						onclick={() => {
							togglerSwitch(comment);
						}}
					>
						<AnnotationSolid /></button
					>
				</div>
				{#if replyToggler[comment.name]}
					<div class={replyToggler[comment.name] === false ? 'toggleDiv' : 'enlargeDiv'}>
						<input id="commentInput" type="text" bind:value={reply} />
						<Reply
							bind:toggle={replyToggler[comment.name]}
							onclick={() => {
								postReply(comment.name, reply);
								togglerSwitch(comment);
							}}
						></Reply>
					</div>
				{/if}
			</div>
			{#if toggler[comment.name]}
				<Replies bind:commentObject commentName={comment.name} />
			{/if}
		</div>
	{/each}
{/if}

<style>
	.subComment {
  width: 200px;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 10px;
}
.commentFooter {
  height: 20px;
  display: flex;
  align-items: flex-end; /* Vertically center items */
  justify-content: flex-start; /* Align items to the right */
}
h4 {
  margin: 0;
  padding: 0;
  background-color: white;
}
#toggler {
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  margin-right: 10px;
}
#post {
  width: 25px;
  height: 20px;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: white;
  margin-left: 10px;
}
.something {
  padding-left: 40px;
  height: 35px;
  padding-top: 5px;
  background-color: white;
  padding-bottom: 5px;
}
.toggleDiv {
  width: 380px;
}
.enlargeDiv {
  width: 200px;
  border: 1px solid black;
  background-color: white;
}
input:focus {
  outline: none;
}
input {
  border: none;
}
button {
  background-color: transparent;
  border-color: transparent;
}

</style>
