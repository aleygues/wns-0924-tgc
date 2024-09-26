import express from "express";
import { Ad, Category } from "./types";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("db.sqlite");
db.run("PRAGMA foreign_keys = ON");

const app = express();

app.use(express.json());

/**
 * CATEGORIES ENDPOINTS
 */
app.get("/categories", (req, res) => {
  db.all("SELECT id, name FROM category", (err, rows: Category[]) => {
    if (err) {
      res.status(500).send();
    } else {
      res.json(rows);
    }
  });
});

app.post("/categories", (req, res) => {
  db.run("INSERT INTO category(name) VALUES (?)", [req.body.name], () => {
    res.status(204).send();
  });
});

app.delete("/categories/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run("DELETE FROM category WHERE id=?", [id], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(204).send();
    }
  });
});

app.put("/categories/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run(
    "UPDATE category SET name=? WHERE id=?",
    [req.body.name, id],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res.status(204).send();
      }
    }
  );
});

/**
 * ADS ENDPOINTS
 */
app.get("/ads", (req, res) => {
  db.all(
    `
    SELECT 
      ad.id AS id,
      category.id AS categoryId, 
      name AS categoryName,
      title, 
      description, 
      owner, 
      location, 
      picture, 
      createdAt
    FROM 
      ad 
      LEFT JOIN category ON category.id = ad.categoryId
    `,
    (err, rows: Ad[]) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res.json(rows);
      }
    }
  );
});

// get one ad

app.post("/ads", (req, res) => {
  db.run(
    "INSERT INTO ad(title, description, owner, price, picture, location, categoryId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.title,
      req.body.description,
      req.body.owner,
      req.body.price,
      req.body.picture,
      req.body.location,
      req.body.categoryId,
      new Date(),
    ],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res.status(204).send();
      }
    }
  );
});

app.delete("/ads/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run("DELETE FROM ad WHERE id=?", [id], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(204).send();
    }
  });
});

// should edit the whole object
// joi → params validation
app.put("/ads/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run(
    "UPDATE ad SET title=?, description=?, owner=?, price=?, picture=?, location=?, categoryId=? WHERE id=?",
    [
      req.body.title,
      req.body.description,
      req.body.owner,
      req.body.price,
      req.body.picture,
      req.body.location,
      req.body.categoryId,
      id,
    ],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res.status(204).send();
      }
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

  db.run(sqlQuery, params, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(204).send();
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000 🚀");
});
