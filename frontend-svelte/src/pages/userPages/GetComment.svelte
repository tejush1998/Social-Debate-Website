<script>
  import { getCommentOfUser } from "../../api/api.js";
  import { onMount } from "svelte";
  import Upvote from "../subComponents/Upvote.svelte";

  let name = [];
  let userId;

  onMount(async () => {
    userId = localStorage.getItem("user");
    name = await getCommentOfUser(userId);
  });
</script>

<div class="left">
  {#each name as cat}
    <main>
      <h2>{cat.comment.name}</h2>
      <h3>{cat.comment.content}</h3>
      <div class="commentFooter">
        <Upvote {userId} comment={cat.comment}></Upvote>
        <div class="commentFooter"></div>
      </div>
    </main>
  {/each}
</div>

<style src="../../styles/get.css"></style>
