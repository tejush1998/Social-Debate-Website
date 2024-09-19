import express from "express";
import { nanoid } from "nanoid";
import { session } from "../../session.js";

const comment = express.Router();

// comment on thread
comment.post("/create/:side/:threadID", async (req, res) => {
  let { side } = req.params;
  const { threadID } = req.params;
  const { userID } = req.body;
  let { content } = req.body;

  content = content || nanoid(12);
  side = side.toUpperCase();

  if (side !== "FOR" && side !== "AGAINST")
    return res.send("for and against accepted");

  const result = await session.run(`MATCH (t:Thread {name:'${threadID}'}) 
                    MATCH (u:User {name:'${userID}'})
                    MERGE (t) <- [r1:COMMENT_TO_THREAD_${side}] - 
                    (c:Comment {name:'${nanoid(4)}', 
                    content:'${content}', upvote:0})
                    <- [r2:PARENT_COMMENT_BY_USER] - (u)
                    return c,r1,t,r2,u`);
  console.log(result);

  return res.send(result);
});

// reply to comment
comment.post("/reply/:commentID", async (req, res) => {
  console.log({ bodye: req.body, parame: req.params });
  const { commentID } = req.params;
  const { userID } = req.body;
  let { reply } = req.body;
  console.log({ commentID, userID, reply });

  reply = reply || nanoid(14);

  await session.run(`MATCH (c:Comment {name:'${commentID}'}) 
                    MATCH (u:User {name:'${userID}'})
                    MERGE (c) <- [r1:REPLY_TO_COMMENT] - 
                    (c1:Comment {name:'${nanoid(4)}', 
                    content:'${reply}', upvote:0})
                    <- [r2:CHILD_COMMENT_BY_USER] - (u)
                    return c,r1,c1,r2,u`);

  return res.send();
});

// upvote a comment if not already upvoted
comment.post("/upvote/:commentID", async (req, res) => {
  const { commentID } = req.params;
  const { userID } = req.body;
  console.log("inside upvote", commentID, userID);

  const result = await session.run(`MATCH (u:User {name:'${userID}'})
  MATCH (c:Comment {name: '${commentID}'})
 FOREACH(x in CASE WHEN EXISTS {
     (u)-[:UPVOTE_COMMENT]->(c)
 } THEN [] ELSE [1] END | 
    SET c.upvote = c.upvote + 1
    MERGE (u) - [r1:UPVOTE_COMMENT] -> (c)
    )
 RETURN u,c`);

  const totalUpvotes = {
    comment: result.records[0].get("c").properties,
    relation: result.records[0].get("u").properties,
  };

  return res.send(totalUpvotes);
});
comment.get("/upvote/:commentID/:userID", async (req, res) => {
  const { commentID, userID } = req.params;
  console.log("get upvote", commentID, userID);

  const result = await session.run(`MATCH (u:User {name:'${userID}'})
    - [r1:UPVOTE_COMMENT] ->
     (c:Comment {name: '${commentID}'})
    RETURN u,c`);

  const check = result.records[0];

  if (!check) return res.send(false);

  return res.send(true);

  // const totalUpvotes = {
  //   comment: result.records[0].get("c").properties,
  //   relation: result.records[0].get("u").properties,
  // };
});
comment.delete("/upvote/:commentID", async (req, res) => {
  const { commentID } = req.params;
  const { userID } = req.body;
  console.log("inside upvote", commentID, userID);

  const result = await session.run(`MATCH (u:User {name: '${userID}'})
      MATCH (c:Comment {name: '${commentID}'})
      FOREACH(x in CASE WHEN EXISTS {
          (u)-[:UPVOTE_COMMENT]->(c)
      } THEN [1] ELSE [] END | 
          SET c.upvote = c.upvote - 1
      )
      WITH u, c
      MATCH (u)-[r1:UPVOTE_COMMENT]->(c)
      DELETE r1
      RETURN u, c
`);

  const totalUpvotes = {
    comment: result.records[0].get("c").properties,
    relation: result.records[0].get("u").properties,
  };

  return res.send(totalUpvotes);
});

// get all comments of a user
comment.get("/getCommentOfUser/:userID", async (req, res) => {
  const { userID } = req.params;

  const result = await session.run(`
  MATCH (u:User {name:'${userID}'}) - [r1:PARENT_COMMENT_BY_USER|CHILD_COMMENT_BY_USER] 
  -> (c:Comment) - [*] -> (t:Thread)
  OPTIONAL MATCH (u) - [r2:UPVOTE_COMMENT] -> (c)
  return u,r1,c,t,r2`);

  const threads = [];

  result.records.forEach((record) => {
    threads.push({
      comment: {
        ...record.get("c").properties,
        upvoteByUser: !!record.get("r2"),
      },
      relation: record.get("r1").type,
    });
  });

  return res.send(threads);
});
comment.get("/getRepliesOfComment/:commentID/:userID", async (req, res) => {
  const { commentID, userID } = req.params;

  const result = await session.run(`
  MATCH (c:Comment {name: '${commentID}'}) 
  <- [r1:REPLY_TO_COMMENT] - (c2:Comment) 
  <- [r3:CHILD_COMMENT_BY_USER] - (u:User) 
    OPTIONAL MATCH (u3:User {name: '${userID}'}) - [:UPVOTE_COMMENT] -> (c2) 
RETURN c, u, r1, c2,u3
`);
  console.log("getRespliesOfComment", commentID);

  const comments = [];

  result.records.forEach((record) => {
    comments.push({
      comment: {
        ...record.get("c2").properties,
        upvoteByUser: !!record.get("u3")?.properties,
      },
      relation: record.get("r1").type,
      issuer: record.get("u").properties,
    });
  });

  return res.send(comments);
});

export default comment;
