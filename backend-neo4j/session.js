import * as dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config();
const { username, url, password, database } = process.env;
const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
  disableLosslessIntegers: true,
});
const session = driver.session({ database });
export { session, neo4j };
