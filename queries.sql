-- database: /home/aleygues/Dev/WCS/0924/tgc-api/db.sqlite

CREATE TABLE ad (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  owner TEXT,
  price INTEGER,
  picture TEXT,
  location TEXT,
  createdAt DATE
);

CREATE TABLE category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

ALTER TABLE ad ADD COLUMN categoryId INTEGER;

ALTER TABLE ad ADD CONSTRAINT FOREIGN KEY (categoryId) REFERENCES category(id);



INSERT INTO ad(title, description, owner, price, picture, location, createdAt) VALUES 
  ("Red bike", "It's a red bike", "aurelien", 10000, "", "Paris", "2024-08-25"),
  ("Blue bike", "It's a Blue bike", "aurelien", 3000, "", "Paris", "2024-08-25"),
  ("Green bike", "It's a Green bike", "aurelien", 2000, "", "Paris", "2024-09-25"),
  ("Purple bike", "It's a Purple bike", "aurelien", 10000, "", "Lyon", "2024-09-25"),
  ("Yellow bike", "It's a Yellow bike", "aurelien", 8000, "", "Bordeaux", "2024-09-25");

SELECT * FROM ad;

SELECT * FROM ad WHERE location="Bordeaux";

SELECT * FROM ad WHERE price > 4000;

UPDATE ad SET price = 0 WHERE createdAt = "2024-09-25";

SELECT AVG(price) FROM ad WHERE location = "Paris";

SELECT AVG(price), location FROM ad GROUP BY location;

-- database: /home/aleygues/Dev/WCS/0924/tgc-api/db.sqlite

PRAGMA foreign_keys = ON;
DELETE FROM category WHERE id=1;

CREATE TABLE category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE ad (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  owner TEXT,
  price INTEGER,
  picture TEXT,
  location TEXT,
  categoryId INTEGER NOT NULL,
  createdAt DATE,
  FOREIGN KEY (categoryId) REFERENCES category(id)
);

INSERT INTO category (name) VALUES ("Vélos"), ("Vêtements"), ("Maisons");

INSERT INTO ad(title, description, owner, price, picture, location, categoryId, createdAt) VALUES 
  ("Vélo rouge", "Il est rouge", "aurelien", 10000, "", "Villeurbanne", 1, "2024-08-25"),
  ("Pull vert", "Il est vert", "aurélien", 2000, "", "Villeurbanne", 2, "2024-09-26"),
  ("Pull rouge", "Il est rouge", "aurélien", 4000, "", "Villeurbanne", 2, "2024-09-26");

SELECT ad.id, ad.title FROM ad JOIN category ON ad.categoryId = category.id WHERE category.name = "Vêtements";

SELECT * FROM ad JOIN category ON ad.categoryId = category.id WHERE category.name IN("Vêtements", "Vélos");

SELECT AVG(ad.price) FROM ad JOIN category ON ad.categoryId = category.id WHERE category.name = "Vêtements";

INSERT INTO ad(title, description, owner, price, picture, location, categoryId, createdAt) VALUES 
  ("Belle maison", "Elle est belle", "aurelien", 100000000, "", "Lyon", 3, "2024-08-25");
SELECT ad.id, ad.title FROM ad JOIN category ON ad.categoryId = category.id WHERE category.name LIKE("v%");

DELETE FROM category WHERE id=1;

/* Afficher les annonces de la catégorie “vêtement”
Afficher les annonces des catégories “vêtement” et “voiture”
Afficher le prix moyen des annonces de la catégorie “autre”
Afficher les annonces des catégories dont le nom commence par un “v” */
