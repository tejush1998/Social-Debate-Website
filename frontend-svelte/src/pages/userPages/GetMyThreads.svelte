<script>
  import { getThreadsOfUser } from "../../api/api.js";
  import { onMount } from "svelte";
  import { Router, Link } from "svelte-routing";
  import ThreadUpvote from "../subComponents/ThreadUpvote.svelte";

  let userId;
  let name = [];

  onMount(async () => {
    userId = localStorage.getItem("user");
    name = await getThreadsOfUser(userId);
  });
</script>

<div class="left">
  <Router>
    {#each name as cat}
      <Link to={`../threads/${cat.name}`}>
        <main>
          <h2>{cat.name}</h2>
          <h3>{cat.description}</h3>
          <div class="commentFooter">
            <ThreadUpvote {userId} thread={cat}></ThreadUpvote>
          </div>
        </main>
      </Link>
    {/each}
  </Router>
</div>

<style src="../../styles/get.css"></style>
