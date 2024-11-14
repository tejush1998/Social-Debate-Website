<script>
	let { toggle = $bindable(), onclick } = $props();
</script>

<div class="footerComment">
	<button
		id="cancelButton"
		onclick={() => {
			toggle = !toggle;
		}}
		type="submit">Cancel</button
	>
	<!--There was an onclick here -->
	<button {onclick} id="postButton" type="submit">Post</button>
</div>

<style>
	.footerComment {
		display: flex;
		justify-content: flex-end;
	}
	button {
		margin-right: 10;
		font-size: x-small;
	}
</style>
