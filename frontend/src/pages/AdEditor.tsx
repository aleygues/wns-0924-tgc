import { useEffect, useState } from "react";
import { CategoryProps } from "../components/Category";
import axios from "axios";

export function AdEditorPage() {
  const [title, setTitle] = useState("Super vélo bleu");
  const [description, setDescription] = useState("Il est très beau");
  const [price, setPrice] = useState(10000);
  const [location, setLocation] = useState("Villeurbanne");
  const [picture, setPicture] = useState("imgurl");
  const [owner, setOwner] = useState("moi");
  const [categoryId, setCategoryId] = useState<number>();

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  useEffect(() => {
    async function fetch() {
      const result = await axios.get<CategoryProps[]>(
        "http://127.0.0.1:5000/categories"
      );
      setCategories(result.data);
      if (result.data.length !== 0) {
        setCategoryId(result.data[0].id);
      }
    }
    fetch();
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          console.log({
            title,
            description,
            price,
            location,
            picture,
            owner,
            categoryId,
          });
          e.preventDefault();
        }}
      >
        <label>
          Titre :
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Prix :
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Description :
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Localisation :
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <br />
        <label>
          Image (URL) :
          <input
            type="text"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </label>
        <br />
        <label>
          Auteur :
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </label>
        <br />
        <label>
          Catégorie :
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <button>Créer mon annonce</button>
      </form>
    </div>
  );
}
