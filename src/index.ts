import "reflect-metadata";
import express from "express";
import { datasource } from "./datasource";
import { router as AdsRouter } from "./controllers/ads";
import { router as CategoriesRouter } from "./controllers/categories";

const app = express();

app.use(express.json());

app.use("/ads", AdsRouter);
app.use("/categories", CategoriesRouter);

async function initialize() {
  await datasource.initialize();
  console.log("Datasource is connected");

  app.listen(5000, () => {
    console.log("Server is running on port 5000 🚀");
  });
}

initialize();
