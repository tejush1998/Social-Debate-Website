<script>
  import { Router, Route, Link } from "svelte-routing";
  import GetMyThreads from "./GetMyThreads.svelte";
  import GetComment from "./GetComment.svelte";
</script>

<Router>
  <div class="top">
    <p id="twx"><Link to="/myPage">Thread</Link></p>
    <p><Link to="comments">Comments</Link></p>
  </div>
  <Route path="/">
    <GetMyThreads />
  </Route>
  <Route path="comments">
    <GetComment />
  </Route>
</Router>

<style src="../../styles/mypage.css"></style>
