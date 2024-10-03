import axios from "axios";
import { useState } from "react";
import { CategoryProps } from "./Category";

export function CategoryEditor(props: { onCategoryCreated: () => void }) {
  const [name, setName] = useState("");

  async function doSubmit() {
    try {
      await axios.post<CategoryProps>("http://localhost:5000/categories", {
        name,
      });
      //
      setName("");
      props.onCategoryCreated();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{
        border: "1px solid black",
        padding: 16,
      }}
    >
      <label>
        Nom de la catégorie :
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <button type="button" onClick={doSubmit}>
        Créer ma catégorie
      </button>
    </div>
  );
}
