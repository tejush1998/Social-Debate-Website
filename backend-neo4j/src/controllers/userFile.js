import express from "express";
import { nanoid } from "nanoid";
import { session } from "../../session.js";

const user = express.Router();

user.post("/create", async (req, res) => {
  let { name } = req.body;
  name = name || nanoid(4);
  await session.run(`CREATE (u:User {name:'${name}'}) return u`);
  return res.send();
});
user.get("/get/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await session.run(
    `MATCH (u:User {name:'${userId}'}) return u`
  );
  console.log('getUser', userId);
  const userInfo = result.records[0].get("u").properties;
  return res.send(userInfo);
});

// get all user general
user.get("/getUsers", async (req, res) => {
  const result = await session.run(`
  MATCH (u:User)
  return u`);

  const users = [];

  result.records.forEach((record) => {
    users.push(record.get("u").properties);
  });

  return res.send(users);
});

export default user;
