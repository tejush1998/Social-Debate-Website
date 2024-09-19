<script>
  import { CaretUpOutline, CaretUpSolid } from "flowbite-svelte-icons";
  import { upvoteThread, downvoteThread } from "../../api/api";

  export let userId;
  export let thread;
  let upvoteToggler = thread.upvoteByUser;

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

<button on:click={() => toggleUpvote(thread.name, userId)}>
  {#if upvoteToggler}
    <CaretUpSolid></CaretUpSolid>
  {:else}
    <CaretUpOutline></CaretUpOutline>
  {/if}

  <!-- <div id="angleUp"></div> -->
</button>
<h4>{thread.upvote}</h4>

<style src="../../styles/threadUpvote.css"></style>
