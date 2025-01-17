import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CategoryType } from "../types";
import { mutationCreateCategory } from "../api/createCategory";
import { queryCategories } from "../api/categories";
import { mutationDeleteCategory } from "../api/deleteCategory";
import { mutationUpdateCategory } from "../api/updateCategory";

function Categories() {
  const [showEditor, setShowEditor] = useState(false);
  const { data } = useQuery<{ categories: CategoryType[] }>(queryCategories);
  const categories = data?.categories;

  // handle delete
  const [doDeleteCategory] = useMutation(mutationDeleteCategory, {
    refetchQueries: [queryCategories],
  });
  async function onDelete(id: number) {
    doDeleteCategory({
      variables: {
        id,
      },
    });
  }

  // form
  const [editingId, setEditingId] = useState<undefined | number>();
  const [name, setName] = useState("");
  const [doCreateCategory] = useMutation<{ createCategory: CategoryType }>(
    mutationCreateCategory,
    {
      refetchQueries: [queryCategories],
    }
  );
  const [doUpdateCategory] = useMutation(mutationUpdateCategory, {
    refetchQueries: [queryCategories],
  });
  async function doSubmit() {
    try {
      if (editingId !== undefined) {
        await doUpdateCategory({
          variables: {
            id: editingId,
            data: {
              name,
            },
          },
        });
        setName("");
        setShowEditor(false);
      } else {
        await doCreateCategory({
          variables: {
            data: {
              name,
            },
          },
        });
        setName("");
        setShowEditor(false);
      }
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    if (showEditor === false) {
      setEditingId(undefined);
    }
  }, [showEditor]);

  // handle update
  async function onUpdate(categoryToUpdate: CategoryType) {
    setShowEditor(true);
    setName(categoryToUpdate.name);
    setEditingId(categoryToUpdate.id);
  }

  return (
    <div>
      <h1>Catégories</h1>
      <button onClick={() => setShowEditor(!showEditor)}>
        {showEditor ? "Cacher" : "Afficher formulaire"}
      </button>
      {showEditor && (
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
            {editingId !== undefined ? "Modifier" : "Créer"}
          </button>
          <hr />
        </div>
      )}
      {categories?.map((category) => (
        <p>
          {category.name} -{" "}
          <button onClick={() => onDelete(category.id)}>Supprimer</button>
          <button onClick={() => onUpdate(category)}>Éditer</button>
        </p>
      ))}
    </div>
  );
}

export function AdminPage() {
  return (
    <div>
      <Categories />
    </div>
  );
}
