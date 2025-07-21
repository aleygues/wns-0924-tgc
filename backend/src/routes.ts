import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import mime from "mime";
import fs from "fs";

const upload = multer({ dest: "tmp/" });

export function getRoutes(): Router {
  const router = Router();

  router.post("/images", upload.single("image"), async (req, res) => {
    try {
      if (req.file) {
        const outputPath = `uploads/${Date.now()}-${
          Math.floor(Math.random() * 8999) + 1000
        }.${mime.getExtension(req.file.mimetype)}`;
        await sharp(req.file.path)
          .resize(1080, 1080, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFile(outputPath);
        try {
          fs.rmSync(req.file.path);
        } catch {
          console.warn(`⚠️ cannot delete temp image`);
        }
        return res.json({ success: true });
      } else {
        return res.status(400).json({ success: false });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false });
    }
  });

  router.get("/images/:filename", async (req, res) => {
    const path = `/app/uploads/${req.params.filename}`;

    if (fs.existsSync(path)) {
      res.sendFile(path);
    } else {
      res.status(404).send();
    }
  });

  return router;
}
