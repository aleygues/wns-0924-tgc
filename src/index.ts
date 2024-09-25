import express from "express";
import { Ad } from "./types";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("db.sqlite");

const app = express();

app.use(express.json());

app.get("/ads", (req, res) => {
  db.all("SELECT * FROM ad", (err, rows: Ad[]) => {
    if (err) {
      res.status(500).send();
    } else {
      res.json(rows);
    }
  });
});

// get one ad

app.post("/ads", (req, res) => {
  db.run(
    "INSERT INTO ad(title, description, owner, price, picture, location, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.title,
      req.body.description,
      req.body.owner,
      req.body.price,
      req.body.picture,
      req.body.location,
      new Date(),
    ],
    () => {
      res.status(204).send();
    }
  );
});

app.delete("/ads/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run("DELETE FROM ad WHERE id=?", [id], () => {
    res.status(204).send();
  });
});

// should edit the whole object
// joi → params validation
app.put("/ads/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run(
    "UPDATE ad SET title=?, description=?, owner=?, price=?, picture=?, location=? WHERE id=?",
    [
      req.body.title,
      req.body.description,
      req.body.owner,
      req.body.price,
      req.body.picture,
      req.body.location,
      id,
    ],
    () => {
      res.status(204).send();
    }
  );
});

// partial edit
app.patch("/ads/:id", (req, res) => {
  const id = Number(req.params.id);

  let sqlQuery = "UPDATE ad SET ";
  const params: (string | number)[] = [];

  /* {
    "title": "Red bike",
    "description": "This is a super bike!",
    "price": 200
  } */

  const bodyKeys = Object.keys(req.body);

  for (const key of bodyKeys) {
    if (["id", "createdAt"].includes(key) === false) {
      sqlQuery += `${key}=?, `;
      params.push(req.body[key]);
    }
  }

  sqlQuery = sqlQuery.slice(0, sqlQuery.length - 2) + " WHERE id=?";
  params.push(id);

  db.run(sqlQuery, params, () => {
    res.status(204).send();
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000 🚀");
});
