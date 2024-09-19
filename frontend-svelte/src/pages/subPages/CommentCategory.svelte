<script>
  import { replyToThread, getThreadById } from "../../api/api.js";
  import { onMount } from "svelte";
  import EachComment from "./EachComment.svelte";
  import Reply from "../subComponents/Reply.svelte";

  export let threadId;
  export let type;
  export let thread;

  let inputValue = type === "FOR" ? "Post For Comment" : "Post Against Comment";
  let userId;
  let toggle = false;

  $: comments = type === "FOR" ? thread?.forComments : thread?.againstComments;
  $: inputValue =
    toggle === true
      ? ""
      : type === "FOR"
        ? "Post For Comment"
        : "Post Against Comment";

  onMount(async () => {
    userId = localStorage.getItem("user");
  });

  const createComment = async (value, type) => {
    await replyToThread(value, type, threadId, userId);
    thread = await getThreadById(threadId, userId);
  };

  const toggler = (value) => {
    toggle = value;
  };
</script>

<div class="commentCategory">
  <div class={toggle === false ? "toggleDiv" : "enlargeDiv"}>
    <input
      id="inputType"
      type="text"
      bind:value={inputValue}
      on:click={() => {
        toggler(true);
      }}
      autocomplete="off"
    />
    {#if toggle}
      <Reply
        bind:toggle
        on:click={() => {
          createComment(inputValue, type);
          toggler(false);
        }}
      ></Reply>
    {/if}
  </div>

  <EachComment commentArray={comments}></EachComment>
</div>

<style src="../../styles/commentCategory.css"></style>
