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
