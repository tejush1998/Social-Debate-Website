<script>
  export let toggle;
</script>

<div class="footerComment">
  <button
    id="cancelButton"
    on:click={() => {
      toggle = !toggle;
    }}
    type="submit">Cancel</button
  >
  <button on:click id="postButton" type="submit">Post</button>
</div>

<style src="../../styles/reply.css"></style>
