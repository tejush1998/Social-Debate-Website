<script>
  import { getAllUsers, createUser } from "../api/api.js";
  import { onMount } from "svelte";

  let userName;
  let userArray = [];
  let toggle = false;

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
    localStorage.setItem("user", name);
  };
  const checkCurrentUser = async () => {
    const user = localStorage.getItem("user");
    return user;
  };

  const createUserRefresh = async (name) => {
    await createUser(name);
    await setUser(name);
    userName = name;
    userArray = await getAllUsers();
  };
</script>

<select bind:value={userName} on:change={() => setUser(userName)}>
  {#each userArray as theUser}
    <option value={theUser.name}>
      {theUser.name}
    </option>
  {/each}
</select>
<button on:click={() => (toggle = !toggle)}></button>

{#if toggle}
  <input id="inputType" type="text" bind:value={userName} />
  <button on:click={() => createUserRefresh(userName)} type="submit"
    >Create user</button
  >
{/if}
