import { session } from "../../session.js";

const getThreads = async (userId) => {
  const result = await session.run(`
    MATCH (t:Thread)
    OPTIONAL MATCH (u: User {name:'${userId}'}) - [:UPVOTE_THREAD] -> (t)
    return t,u`);

  const threads = [];

  result.records.forEach((record) => {
    threads.push({
      ...record.get("t").properties,
      upvoteByUser: !!record.get("u")?.properties,
    });
  });
  return threads;
};
const getSimpleThreadById = async (threadId) => {
  const result = await session.run(`
  MATCH (t:Thread {name: '${threadId}'})
    return t`);

  const threads = [];

  result.records.forEach((record) => {
    threads.push(record.get("t").properties);
  });
  return threads;
};

export { getThreads, getSimpleThreadById };
