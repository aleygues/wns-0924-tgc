import "reflect-metadata";
import express from "express";
import cors from "cors";
import { datasource } from "./datasource";
import { router as AdsRouter } from "./controllers/ads";
import { router as CategoriesRouter } from "./controllers/categories";
import { router as TagsRouter } from "./controllers/tags";

const app = express();

app.use(express.json());
app.use(cors()); // openbar

app.use("/ads", AdsRouter);
app.use("/categories", CategoriesRouter);
app.use("/tags", TagsRouter);

async function initialize() {
  await datasource.initialize();
  console.log("Datasource is connected");

  app.listen(5000, () => {
    console.log("Server is running on port 5000 🚀");
  });
}

initialize();
