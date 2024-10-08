import axios from "axios";
import { useState } from "react";
import { TagType } from "../types";

export function TagEditor(props: { onTagCreated: (newId: number) => void }) {
  const [name, setName] = useState("");

  async function doSubmit() {
    try {
      const result = await axios.post<TagType>("http://localhost:5000/tags", {
        name,
      });
      setName("");
      props.onTagCreated(result.data.id);
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
        Nom du tag :
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <button type="button" onClick={doSubmit}>
        Créer mon tag
      </button>
    </div>
  );
}
