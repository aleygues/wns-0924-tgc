import express from "express";
import { Tag } from "../entities/Tag";

export const router = express.Router();

router.get("", async (req, res) => {
  const tags = await Tag.find();
  res.json(tags);
});

router.post("", async (req, res) => {
  const newTag = new Tag();
  newTag.name = req.body.name;
  await newTag.save();
  res.json(newTag);
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const tag = await Tag.findOneBy({ id });
    if (tag !== null) {
      await tag.remove();
      res.json(tag);
    } else {
      res.status(404).send();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const tag = await Tag.findOneBy({ id });
    if (tag !== null) {
      Object.assign(tag, req.body);
      await tag.save();
      res.json(tag);
    } else {
      res.status(404).send();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});
