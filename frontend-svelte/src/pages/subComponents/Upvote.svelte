<script>
  import { CaretUpOutline, CaretUpSolid } from "flowbite-svelte-icons";
  import { upvoteComment, downvoteComment } from "../../api/api";

  export let userId;
  export let comment;
  console.info({ comment: comment.upvoteByUser });
  let upvoteToggler = comment.upvoteByUser;

  const toggleUpvote = async (commentId, userId) => {
    console.info("toggleUpvote", upvoteToggler);
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

<button on:click={() => toggleUpvote(comment.name, userId)}>
  {#if upvoteToggler}
    <CaretUpSolid></CaretUpSolid>
  {:else}
    <CaretUpOutline></CaretUpOutline>
  {/if}

  <!-- <div id="angleUp"></div> -->
</button>
<h4>{comment.upvote}</h4>

<style src="../../styles/upvote.css"></style>
