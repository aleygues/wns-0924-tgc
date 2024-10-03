import { useEffect, useState } from "react";
import { CategoryProps } from "../components/Category";
import axios from "axios";
import { Tag } from "../types";
import { useNavigate } from "react-router-dom";
import { AdProps } from "../components/Ad";

export function AdEditorPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("Super vélo bleu");
  const [description, setDescription] = useState("Il est très beau");
  const [price, setPrice] = useState(10000);
  const [location, setLocation] = useState("Villeurbanne");
  const [picture, setPicture] = useState("https://google.com");
  const [owner, setOwner] = useState("moi@aleygues.fr");
  const [categoryId, setCategoryId] = useState<number>();
  const [tagsIds, setTagsIds] = useState<number[]>([]);

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    async function fetch() {
      {
        const result = await axios.get<CategoryProps[]>(
          "http://127.0.0.1:5000/categories"
        );
        setCategories(result.data);
        if (result.data.length !== 0) {
          setCategoryId(result.data[0].id);
        }
      }

      {
        const result = await axios.get<Tag[]>("http://127.0.0.1:5000/tags");
        setTags(result.data);
      }
    }
    fetch();
  }, []);

  async function doSubmit() {
    try {
      const result = await axios.post<AdProps>("http://localhost:5000/ads", {
        title,
        description,
        price,
        location,
        picture,
        owner,
        category: categoryId ? { id: categoryId } : null,
        tags: tagsIds.map((id) => ({ id })),
      });
      navigate(`/ads/${result.data.id}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doSubmit();
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
        <div>
          Tags :
          {tags.map((tag) => (
            <label key={tag.id}>
              <input
                type="checkbox"
                checked={tagsIds.includes(tag.id) === true}
                onClick={() => {
                  if (tagsIds.includes(tag.id) === true) {
                    const newArray = [];
                    for (const entry of tagsIds) {
                      if (entry !== tag.id) {
                        newArray.push(entry);
                      }
                    }
                    // const newArray = tagsIds.filter(t => tag.id !== t.id)

                    setTagsIds(newArray);
                  } else {
                    tagsIds.push(tag.id);

                    const newArray = [];
                    for (const entry of tagsIds) {
                      newArray.push(entry);
                    }
                    // const newArray = tagsIds.slice()

                    setTagsIds(newArray);
                  }
                }}
              />
              {tag.name}
            </label>
          ))}
        </div>
        <br />
        <br />
        <button>Créer mon annonce</button>
      </form>
    </div>
  );
}
