import express from "express";
import { Ad } from "../entities/Ad";
import { validate } from "class-validator";

export const router = express.Router();

router.get("", async (req, res) => {
  const ads = await Ad.find({
    relations: {
      category: true,
      tags: true,
    },
  });
  res.json(ads);
});

router.get("/:id", async (req, res) => {
  const ad = await Ad.findOne({
    where: {
      id: Number(req.params.id),
    },
    relations: {
      category: true,
      tags: true,
    },
  });

  res.json(ad);
});

router.post("", async (req, res) => {
  try {
    const newAd = new Ad();
    Object.assign(newAd, req.body);

    const errors = await validate(newAd);
    if (errors.length) {
      res.status(400).json(errors);
    } else {
      await newAd.save();
      res.json(newAd);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ad = await Ad.findOneBy({ id });
    if (ad !== null) {
      await ad.remove();
      res.json(ad);
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
    const ad = await Ad.findOneBy({ id });
    if (ad !== null) {
      const newAd = new Ad();
      Object.assign(newAd, req.body, { id: ad.id, createdAt: ad.createdAt });

      const errors = await validate(newAd);
      if (errors.length) {
        res.status(400).json(errors);
      } else {
        await newAd.save();
        res.json(newAd);
      }
    } else {
      res.status(404).send();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

// partial edit
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ad = await Ad.findOneBy({ id });
    if (ad !== null) {
      Object.assign(ad, req.body);

      const errors = await validate(ad);
      if (errors.length) {
        res.status(400).json(errors);
      } else {
        await ad.save();
        res.json(ad);
      }
    } else {
      res.status(404).send();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});
