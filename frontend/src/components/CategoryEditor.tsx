import { useState } from "react";
import { queryCategories } from "../api/categories";
import { mutationCreateCategory } from "../api/createCategory";
import { useMutation } from "@apollo/client";

export function CategoryEditor(props: {
  onCategoryCreated: (newId: number) => void;
}) {
  const [name, setName] = useState("");

  const [doCreateCategory] = useMutation(mutationCreateCategory, {
    refetchQueries: [queryCategories],
  });
  async function doSubmit() {
    try {
      const { data } = await doCreateCategory({
        variables: {
          data: {
            name,
          },
        },
      });
      setName("");
      if (data) {
        props.onCategoryCreated(Number(data.createCategory.id));
      }
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
