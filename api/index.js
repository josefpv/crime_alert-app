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
  const { rows: crimeTypes } = await pgClient.query(
    "SELECT * FROM crime_types"
  );
  console.log(crimeTypes);
  res.send(crimeTypes);
});

app.post("/alert/new", async (req, res) => {
  const coors = JSON.stringify(req.body.coors);
  const type_crime = req.body.type_crime;
  const crime_details = req.body.details;
  const current_datetime = getCurrentDateTime();
  console.log(coors);

  const result = await pgClient.query(
    `INSERT INTO "crime_events" ("event_date", "coors", "details", "crime_type") VALUES ($1, $2, $3, $4)`,
    [current_datetime, coors, crime_details, type_crime]
  );

  //console.log(result);
  res.send({ completado: true, msg: "Se ha generado la alerta." });
});

app.get("/alerts", async (req, res) => {
  const currentDate = getCurrentDate();
  const { rows: alerts } = await pgClient.query(
    `SELECT crime_events.id, crime_events.event_date, crime_events.coors, crime_events.details, crime_events.crime_type, crime_types.description  FROM crime_events  LEFT JOIN crime_types ON crime_types.id = crime_events.crime_type WHERE TO_CHAR(event_date, 'yyyy-mm-dd') = $1`,
    [currentDate]
  );
  console.log(alerts);
  res.send(alerts);
});

const getCurrentDate = () => {
  const date_ob = new Date();
  const day = ("0" + date_ob.getDate()).slice(-2);
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  const year = date_ob.getFullYear();
  const hours = date_ob.getHours();
  const minutes = date_ob.getMinutes();
  const seconds = date_ob.getSeconds();
  console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  return `${year}-${month}-${day}`;
};

const getCurrentDateTime = () => {
  const date_ob = new Date();
  const day = ("0" + date_ob.getDate()).slice(-2);
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  const year = date_ob.getFullYear();
  const hours = date_ob.getHours();
  const minutes = date_ob.getMinutes();
  const seconds = date_ob.getSeconds();
  console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

app.listen(5000, (err) => {
  console.log("Listening...");
});
