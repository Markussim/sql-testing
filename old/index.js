const express = require("express");
const { Pool, Client } = require("pg");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "nodetesting",
  password: "1",
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.get("/get", async (req, res) => {
  let text = await (await pool.query("FULL OUTER JOIN ")).rows;
  res.send(text);
});

app.post("/addUser", async (req, res) => {
  if (
    (await (
      await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_name = $1;",
        [req.body.UserName]
      )
    ).rows.length) == 0
  ) {
    let insert = [req.body.UserName, req.body.BestFriend];
    await pool.query(
      "INSERT INTO Users(UserName, BestFriend) VALUES ($1, $2);",
      insert
    );
    await pool.query(
      "CREATE TABLE " + req.body.UserName + " (Post varchar(255));"
    );
  }

  res.redirect("/get");
});

app.get("/post", async (req, res) => {
  res.sendFile(__dirname + "/client/post.html");
});

app.post("/post", async (req, res) => {
  console.log((await (
    await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_name = $1;",
      [req.body.UserName]
    )
  ).rows))
  if (
    (await (
      await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_name = $1;",
        [req.body.UserName]
      )
    ).rows.length) == 1
  ) {
    console.log("Added")
    await pool.query(
      "INSERT INTO " + req.body.UserName + "(Post) VALUES ($1);",
      [req.body.post]
    );
  }

  res.redirect("/get");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
