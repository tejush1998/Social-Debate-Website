<script>
  //dispatcher and bindings are for reverse processes
  import { Router, Route, Link } from "svelte-routing";
  import MyPage from "./userPages/MyPage.svelte";
  import Threads from "./Threads.svelte";
  import ThreadInfo from "./subPages/ThreadInfo.svelte";

</script>

<!-- this is javascript routing not server routing -->
<body>
  <Router>
    <div class="top">
      <Link to="/">Home</Link>
      <Link to="myPage">My Page</Link>
    </div>
    <Route path="/">
      <Threads />
    </Route>
    <Route path="myPage/*">
      <MyPage />
    </Route>
    <Route path="threads/:id" let:params>
      <ThreadInfo threadId={params.id} />
    </Route>
  </Router>


</body>

<style src="../styles/app.css"></style>
