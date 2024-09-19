<script>
  import { onMount } from "svelte";
  import { Router, Link } from "svelte-routing";
  import { getAllThreads, createThread } from "../api/api.js";
  import GetUser from "./GetUser.svelte";
  import ThreadUpvote from "./subComponents/ThreadUpvote.svelte";

  let threads = [];
  let newThread;
  let userId;

  onMount(async () => {
    userId = localStorage.getItem("user");
    threads = await getAllThreads(userId);
  });

  const createNewThread = async (value) => {
    await createThread(userId, value);
    threads = await getAllThreads(userId);
  };
</script>

<Router>
  <div class="mainHolder">
    <form on:submit|preventDefault={() => createNewThread(newThread)}>
      <input id="inputType" type="text" bind:value={newThread} />
      <button type="submit">Post thread</button>
    </form>
  </div>

  <div class="mid">
    <GetUser />
  </div>

  <div class="left">
    {#each threads as cat}
      <main>
        <Link to={`threads/${cat.name}`}>
          <h2>{cat.name}</h2>
          <h3>{cat.description}</h3>
        </Link>
        <div class="commentFooter">
          <ThreadUpvote {userId} thread={cat}></ThreadUpvote>
        </div>
      </main>
    {/each}
  </div>
</Router>

<style src="../styles/get.css"></style>
