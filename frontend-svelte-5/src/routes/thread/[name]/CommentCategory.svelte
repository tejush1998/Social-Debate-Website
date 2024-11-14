<script>
	import { replyToThread, getThreadById } from '$lib/api.js';
	import { onMount } from 'svelte';
	import EachComment from './EachComment.svelte';
	import Reply from '$lib/Reply.svelte';
	import { CircleMinusOutline } from 'flowbite-svelte-icons';

	let { threadId, type, thread = $bindable() } = $props();

	let userId = $state('');
	let toggle = $state(false);

	let comments = $state(type === 'FOR' ? thread?.forComments : thread?.againstComments);
	console.info({ thread, comments, type, threadId });
	$inspect(comments);
	// $inspect(thread);
	let defaultInputValue = type === 'FOR' ? 'Post For Comment' : 'Post Against Comment';
	let inputValue = $state('');

	onMount(async () => {
		userId = localStorage.getItem('user');
	});

	const createComment = async (value, type) => {
		console.info({ value, type });
		await replyToThread(value, type, threadId, userId);
		thread = await getThreadById(threadId, userId);
	};

	const toggler = (value) => {
		toggle = value;
	};
</script>

<div class="commentCategory">
	<div class={toggle === false ? 'toggleDiv' : 'enlargeDiv'}>
		<input
			id="inputType"
			type="text"
			bind:value={inputValue}
			placeholder={toggle ? '' : defaultInputValue}
			onclick={() => {
				toggler(true);
			}}
			autocomplete="off"
		/>
		{#if toggle}
			<Reply
				bind:toggle
				onclick={() => {
					createComment(inputValue, type);
					toggler(false);
				}}
			></Reply>
		{/if}
	</div>

	<!-- {#if comments} -->
	<EachComment commentArray={comments}></EachComment>
	<!-- {/if} -->
</div>

<style>
	.commentCategory {
		width: 310px;
		margin: 5px;
		padding-left: 30px;
	}

	input {
		border: none;
	}
	input:focus {
		outline: none;
	}
	.toggleDiv {
		width: 380px;
	}
	.enlargeDiv {
		width: 380px;
		border: 1px solid black;
		background-color: white;
	}
</style>
