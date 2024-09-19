<script>
  import { getThreadById } from "../../api/api.js";
  import { onMount } from "svelte";
  import CommentCategory from "./CommentCategory.svelte";
  import ThreadUpvote from "../subComponents/ThreadUpvote.svelte";
  export let threadId;

  let userId;
  let thread;

  onMount(async () => {
    userId = localStorage.getItem("user");
    thread = await getThreadById(threadId, userId);
    console.info({ thread });
  });

  $: threadInfo = thread?.threadInfo;
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
    <CommentCategory bind:thread {threadId} type={"FOR"} />
    <CommentCategory bind:thread {threadId} type={"AGAINST"} />
  </div>
</div>

<style src="../../styles/threadInfo.css"></style>
