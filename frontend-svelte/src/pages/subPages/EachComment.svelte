<script>
  import { getReplyToComment, postReplyToComment } from "../../api/api.js";
  import { CirclePlusOutline, CirclePlusSolid } from "flowbite-svelte-icons";
  import { AnnotationSolid } from "flowbite-svelte-icons";
  import Replies from "./Replies.svelte";
  import { onMount } from "svelte";
  import Reply from "../subComponents/Reply.svelte";
  import Upvote from "../subComponents/Upvote.svelte";

  export let commentArray;

  console.info({ commentArray });
  let commentObject = {};
  let toggler = {};
  let replyToggler = {};
  let reply;
  let userId;

  onMount(async () => {
    userId = localStorage.getItem("user");
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
          <button id="toggler" on:click={() => toggleComment(comment.name)}>
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
            on:click={() => {
              togglerSwitch(comment);
            }}
          >
            <AnnotationSolid /></button
          >
        </div>
        {#if replyToggler[comment.name]}
          <div
            class={replyToggler[comment.name] === false
              ? "toggleDiv"
              : "enlargeDiv"}
          >
            <input id="commentInput" type="text" bind:value={reply} />
            <Reply
              bind:toggle={replyToggler[comment.name]}
              on:click={() => {
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

<style src="../../styles/eachComment.css"></style>
