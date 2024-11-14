<script>
	import { onMount } from 'svelte';
	import { getAllThreads, createThread } from '$lib/api.js';
	import GetUser from '$lib/GetUser.svelte';
	import ThreadUpvote from '$lib/ThreadUpvote.svelte';

	let threads = $state([]);
	let newThread = $state('');
	let userId = $state('');

	onMount(async () => {
		userId = localStorage.getItem('user');
		threads = await getAllThreads(userId);
	});

	const createNewThread = async (value) => {
		await createThread(userId, value);
		threads = await getAllThreads(userId);
	};
</script>

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
			<!-- <Link to={`threads/${cat.name}`}> -->
			<a href="/thread/{cat.name}">
				<h2>{cat.name}</h2>
				<h3>{cat.description}</h3>
			</a>
			<!-- </Link> -->
			<div class="commentFooter">
				<ThreadUpvote {userId} thread={cat}></ThreadUpvote>
			</div>
		</main>
	{/each}
</div>

<style>
	main {
		text-align: center;
		background-color: #fefffe;
		color: black;
	}
	h2,
	h3 {
		color: black;
	}
	.left {
		display: inline-block;
		width: 640px;
		margin-left: 230px;
		overflow: auto; /* Enable scrolling when necessary */
		height: 500px;
		padding: 0px;
	}
	
	.mid {
		display: inline-block;
		vertical-align: top;
		text-align: center;
		background-color: #fefffe;
		width: 200px;
		margin-top: 20px;
		margin-left: 30px;
	}
	.mainHolder {
		display: inline-block;
		width: 640px;
		margin-left: 230px;
		margin-top: 20px;
	}
	#inputType {
		width: 640px;
		height: 100px;
	}
	.commentFooter {
		height: 20px;
		display: flex;
		align-items: flex-end; /* Vertically center items */
		justify-content: flex-start; /* Align items to the right */
	}
</style>
