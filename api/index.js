const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

/*
const pgClient = new Pool({
  user: "josevivas",
  host: "35.192.27.130",
  database: "crime_alerts",
  password: "nfs2008yo",
  port: 5432,
});
*/

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/crimetypes", async (req, res) => {
  const crimeTypes = [
    { id: 1, description: "Asalto" },
    { id: 2, description: "Otro" },
  ];
  //const crimeTypes = await pgClient.query("SELECT * FROM crime_types");
  res.send(crimeTypes);
});

app.listen(5000, (err) => {
  console.log("Listening...");
});
