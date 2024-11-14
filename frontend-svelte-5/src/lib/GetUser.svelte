<script>
	import { getAllUsers, createUser } from '$lib/api.js';
	import { onMount } from 'svelte';

	let userName = $state('');
	let userArray = $state([]);
	let toggle = $state(false);

	onMount(async () => {
		userArray = await getAllUsers();
		const checkName = await checkCurrentUser();
		if (checkName) {
			userName = checkName;
		} else if (userArray.length) {
			let name = userArray[0].name;
			await setUser(name);
			userName = name;
		}
	});
	const setUser = async (name) => {
		localStorage.setItem('user', name);
	};
	const checkCurrentUser = async () => {
		const user = localStorage.getItem('user');
		return user;
	};

	const createUserRefresh = async (name) => {
		await createUser(name);
		await setUser(name);
		userName = name;
		userArray = await getAllUsers();
	};
</script>

<select bind:value={userName} onchange={() => setUser(userName)}>
	{#each userArray as theUser}
		<option value={theUser.name}>
			{theUser.name}
		</option>
	{/each}
</select>
<button onclick={() => (toggle = !toggle)}></button>

{#if toggle}
	<input id="inputType" type="text" bind:value={userName} />
	<button onclick={() => createUserRefresh(userName)} type="submit">Create user</button>
{/if}
