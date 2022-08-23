const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const keys = require("./keys");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/crimetypes", async (req, res) => {
  /*
  const crimeTypes = [
    { id: 1, description: "Asalto" },
    { id: 2, description: "Otro" },
  ];
  */
  const crimeTypes = await pgClient.query("SELECT * FROM crime_types");
  console.log(crimeTypes);
  res.send(crimeTypes);
});

app.listen(5000, (err) => {
  console.log("Listening...");
});
