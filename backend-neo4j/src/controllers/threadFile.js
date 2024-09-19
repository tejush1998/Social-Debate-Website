/* eslint-disable no-unused-expressions */
import express from "express";
import { nanoid } from "nanoid";
import { session } from "../../session.js";
import { getThreads } from "./threadHelper.js";

const thread = express.Router();

// create a thread
thread.post("/create/:userID", async (req, res) => {
  const { userID } = req.params;
  let { content } = req.body;
  content = content || nanoid(18);

  await session.run(`MATCH (u:User {name:'${userID}'})
                    MERGE (u) - [r1:CREATE_THREAD] ->
                    (t:Thread {name:'${nanoid(4)}', 
                    description:'${content}',
                    upvote:0}) 
                    return t,r1,u`);

  return res.send();
});

// upvote a thread if not already upvoted
thread.post("/upvote/:threadID", async (req, res) => {
  const { threadID } = req.params;
  const { userID } = req.body;

  const result = await session.run(`MATCH (u:User {name:'${userID}'})
  MATCH (t:Thread {name: '${threadID}'})
 FOREACH(x in CASE WHEN EXISTS {
     (u)-[:UPVOTE_THREAD]->(t)
 } THEN [] ELSE [1] END | 
    SET t.upvote = t.upvote + 1
    MERGE (u) - [r1:UPVOTE_THREAD] -> (t)
    )
 RETURN u,t`);

  const totalUpvotes = {
    thread: result.records[0].get("t").properties,
    relation: result.records[0].get("u").properties,
  };
  return res.send(totalUpvotes);
});
thread.delete("/upvote/:threadID", async (req, res) => {
  const { threadID } = req.params;
  const { userID } = req.body;
  console.log("inside upvote", threadID, userID);

  const result = await session.run(`MATCH (u:User {name: '${userID}'})
      MATCH (t:Thread {name: '${threadID}'})
      FOREACH(x in CASE WHEN EXISTS {
          (u)-[:UPVOTE_THREAD]->(t)
      } THEN [1] ELSE [] END | 
          SET t.upvote = t.upvote - 1
      )
      WITH u, t
      MATCH (u)-[r1:UPVOTE_THREAD]->(t)
      DELETE r1
      RETURN u, t
`);

  const totalUpvotes = {
    thread: result.records[0].get("t").properties,
    relation: result.records[0].get("u").properties,
  };

  return res.send(totalUpvotes);
});
thread.get("/upvote/:threadID/:userID", async (req, res) => {
  const { threadID, userID } = req.params;
  console.info({ threadID, userID });

  const result = await session.run(`
  MATCH (t:Thread {name: '${threadID}'})
  OPTIONAL MATCH (u1:User  {name: '${userID}'}) - [r3:UPVOTE_COMMENT]
  -> (c1:Comment) - [r1:COMMENT_TO_THREAD_FOR] -> (t)
  RETURN t, c1,u1,null as c2,null as u2
  UNION
  MATCH (t:Thread {name: '${threadID}'})
  OPTIONAL MATCH (u2:User  {name: '${userID}'}) - [r4:UPVOTE_COMMENT]
  -> (c2:Comment) - [r2:COMMENT_TO_THREAD_AGAINST] -> (t)
  RETURN t, c2,u2,null as c1, null as u1
  
  `);
  console.info({ result });

  const comments = [];
  const threadInfo = result.records[0].get("t").properties;

  result.records.forEach((record) => {
    const getForComment = record.get("c1");
    if (getForComment) {
      comments.push({
        ...record.get("c1").properties,
        userName: record.get("u1").properties.name,
      });
    }
    const getAgainstComment = record.get("c2");
    if (getAgainstComment) {
      comments.push({
        ...record.get("c2").properties,
        userName: record.get("u2").properties.name,
      });
    }
  });

  return res.send({ threadInfo, comments });
  // return res.send({});
});

// get thread and its child comment
thread.get("/getThreadById/:threadID/:userID", async (req, res) => {
  const { threadID, userID } = req.params;

  const result = await session.run(`
  MATCH (t:Thread {name: '${threadID}'})
  OPTIONAL MATCH (u1:User) - [:PARENT_COMMENT_BY_USER] -> (c1:Comment) - [:COMMENT_TO_THREAD_FOR] -> (t)
  OPTIONAL MATCH (creator:User) - [:CREATE_THREAD] -> (t)
  OPTIONAL MATCH (u3:User {name: '${userID}'}) - [:UPVOTE_COMMENT] -> (c1) - [:COMMENT_TO_THREAD_FOR] -> (t)
  OPTIONAL MATCH (c1) <- [:REPLY_TO_COMMENT] - (r1:Comment)  
  WITH t, c1, u1, creator, u3, COUNT(r1) AS c1HasReplies  
  RETURN t, c1, u1, null AS c2, null AS u2, creator, u3, c1HasReplies, null AS c2HasReplies 
  UNION
  MATCH (t:Thread {name: '${threadID}'})
  OPTIONAL MATCH (u2:User) - [:PARENT_COMMENT_BY_USER] -> (c2:Comment) - [:COMMENT_TO_THREAD_AGAINST] -> (t)
  OPTIONAL MATCH (creator:User) - [:CREATE_THREAD] -> (t)
  OPTIONAL MATCH (u3:User {name: '${userID}'}) - [:UPVOTE_COMMENT] -> (c2) - [:COMMENT_TO_THREAD_AGAINST] -> (t)
  OPTIONAL MATCH (c2) <- [:REPLY_TO_COMMENT] - (r2:Comment)  
  WITH t, c2, u2, creator, u3, COUNT(r2) AS  c2HasReplies 
  RETURN t, null AS c1, null AS u1, c2, u2, creator, u3, c2HasReplies, null AS c1HasReplies

  
  `);

  const forComments = [];
  const againstComments = [];
  const threadInfo = result.records[0].get("t").properties;
  const creator = result.records[0].get("creator").properties.name;
  threadInfo.creator = creator;

  result.records.forEach((record) => {
    const getForComment = record.get("c1");
    if (getForComment) {
      forComments.push({
        ...record.get("c1").properties,
        userName: record.get("u1").properties.name,
        upvoteByUser: !!record.get("u3")?.properties.name,
        totalReplies: record.get("c1HasReplies"),
      });
    }
    const getAgainstComment = record.get("c2");
    if (getAgainstComment) {
      againstComments.push({
        ...record.get("c2").properties,
        userName: record.get("u2").properties.name,
        upvoteByUser: !!record.get("u3")?.properties.name,
        totalReplies: record.get("c2HasReplies"),
      });
    }
  });

  return res.send({ threadInfo, forComments, againstComments });
});

// get all threads general
thread.get("/getThreads/:userID", async (req, res) => {
  const { userID } = req.params;

  const threads = await getThreads(userID);
  return res.send(threads);
});

// get all threads of a user
thread.get("/getThreadsOfUser/:userID", async (req, res) => {
  const { userID } = req.params;

  const result = await session.run(`
  MATCH (u:User {name:'${userID}'}) -[r1:CREATE_THREAD] -> (t:Thread)
  return u,r1,t`);

  const threads = [];

  result.records.forEach((record) => {
    threads.push(record.get("t").properties);
  });

  return res.send(threads);
});

thread.delete("/:threadID", async (req, res) => {
  const { threadID } = req.params;

  try {
    // Execute the query to delete the thread and all its related nodes/relationships
    await session.run(
      `
      MATCH (t:Thread {name: $threadID})
      OPTIONAL MATCH (t) -[r]- (related)  // Match all relationships of the thread
      DETACH DELETE t, related            // Delete the thread and related nodes
    `,
      { threadID }
    );

    res.status(200).send({
      message:
        "Thread and all connected nodes/relationships deleted successfully.",
    });
  } catch (err) {
    res.status(500).send({ error: "Failed to delete the thread" });
  }
});

export default thread;
