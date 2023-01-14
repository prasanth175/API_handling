const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
module.exports = app;

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (req, res) => {
  const getQuery = `
    SELECT * FROM cricket_team ORDER BY player_id
    `;
  const result = await db.all(getQuery);
  res.send(result);
});

app.post("/players/", async (req, res) => {
  const player_details = req.body;
  const { player_id, player_name, jersey_number, role } = player_details;

  const addQuery = `
    INSERT INTO cricket_team (player_id, player_name, jersey_number, role)
    VALUES 
    (
        ${player_id},
         '${player_name}',
         ${jersey_number},
         '${role}');
    `;
  const dbResponse = await db.run(addQuery);
  const playerId = dbResponse.lastID;
  res.send("Player Added to Team");
});

app.get("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const getOne = `
    SELECT * FROM book WHERE 
    player_id = ${playerId}
    `;
  const dbRes = await db.get(getOne);
  dbRes.send(dbRes);
});

app.put("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const updateOne = `
    UPDATE cricket_team 
    SET 
    player_id = ${player_id},
    player_name = '${player_name}',
    jersey_number = ${jersey_number},
    role = '${role}') 
    WHERE player_id = ${playerId};
    `;

  const dbScan = await db.run(updateOne);
  res.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const delQuery = `
    DELETE FROM cricket_team 
    WHERE player_id = ${playerID}
    `;

  await db.run(delQuery);
  res.send("Player removed");
});
