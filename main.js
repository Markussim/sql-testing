const express = require("express");
const fs = require("fs");
const { Pool, Client } = require("pg");
const app = express();
const port = 3000;
const getall = fs.readFileSync("./getall.sql", { encoding: "utf8", flag: "r" });

app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "testsocial",
  password: "1",
});

app.get("/", async (req, res) => {
  res.send(await (await pool.query(getall)).rows);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
