import express from "express";
import { Ad } from "./types";

const app = express();

app.use(express.json());

const ads: Ad[] = [
  {
    id: 1,
    title: "Bike to sell",
    description:
      "My bike is blue, working fine. I'm selling it because I've got a new one",
    owner: "bike.seller@gmail.com",
    price: 100,
    picture:
      "https://images.lecho.be/view?iid=dc:113129565&context=ONLINE&ratio=16/9&width=640&u=1508242455000",
    location: "Paris",
    createdAt: "2023-09-05T10:13:14.755Z",
  },
  {
    id: 2,
    title: "Car to sell",
    description:
      "My car is blue, working fine. I'm selling it because I've got a new one",
    owner: "car.seller@gmail.com",
    price: 10000,
    picture:
      "https://www.automobile-magazine.fr/asset/cms/34973/config/28294/apres-plusieurs-prototypes-la-bollore-bluecar-a-fini-par-devoiler-sa-version-definitive.jpg",
    location: "Paris",
    createdAt: "2023-10-05T10:14:15.922Z",
  },
];

app.get("/ads", (req, res) => {
  res.json(ads);
});

app.post("/ads", (req, res) => {
  const ad: Ad = req.body;
  ad.id = ads[ads.length - 1].id + 1;
  ads.push(ad);
  res.json({
    id: ad.id,
  });
});

app.delete("/ads/:id", (req, res) => {
  const id = Number(req.params.id);

  /* const index = ads.findIndex((ad) => {
    return ad.id === id;
  }); */
  let index = -1;
  for (let i = 0; i < ads.length; i++) {
    if (ads[i].id === id) {
      index = i;
      break;
    }
  }

  ads.splice(index, 1);

  res.json({
    id: id,
  });
});

// TODO, should edit the whole object
app.put("/ads/:id", (req, res) => {});

// partial edit
app.patch("/ads/:id", (req, res) => {
  const id = Number(req.params.id);
  const values = req.body;

  // const adToEdit = ads.find(ad => ad.id === id);
  let adToEdit: Ad | undefined;
  for (const ad of ads) {
    if (ad.id === id) {
      adToEdit = ad;
      break;
    }
  }

  if (adToEdit) {
    Object.assign(adToEdit, values, { id: adToEdit.id });
    res.json(adToEdit);
  } else {
    res.status(404).send();
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000 🚀");
});
