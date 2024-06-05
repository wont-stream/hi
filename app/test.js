import DB from "./db";
const db = await DB("./db.json");

await db.set("test", "ok");
