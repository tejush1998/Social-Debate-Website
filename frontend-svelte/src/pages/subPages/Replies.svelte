<!-- CommentCategory.svelte -->
<script>
  import { slide } from "svelte/transition";
  import { AngleUpOutline } from "flowbite-svelte-icons";
  import Upvote from "../subComponents/Upvote.svelte";
  import { onMount } from "svelte";

  export let commentName;
  export let commentObject;
  let userId;

  onMount(async () => {
    userId = localStorage.getItem("user");
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

<style src="../../styles/replies.css"></style>
