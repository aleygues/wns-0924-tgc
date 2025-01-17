import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { AdType, CategoryType, TagType } from "../types";
import { mutationCreateCategory } from "../api/createCategory";
import { queryCategories } from "../api/categories";
import { mutationDeleteCategory } from "../api/deleteCategory";
import { mutationUpdateCategory } from "../api/updateCategory";
import { mutationUpdateTag } from "../api/updateTag";
import { mutationCreateTag } from "../api/createTag";
import { mutationDeleteTag } from "../api/deleteTag";
import { queryTags } from "../api/tags";
import { queryAds } from "../api/ads";
import { Link } from "react-router-dom";

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

function Tags() {
  const [showEditor, setShowEditor] = useState(false);
  const { data } = useQuery<{ tags: TagType[] }>(queryTags);
  const tags = data?.tags;

  // handle delete
  const [doDeleteTag] = useMutation(mutationDeleteTag, {
    refetchQueries: [queryTags],
  });
  async function onDelete(id: number) {
    doDeleteTag({
      variables: {
        id,
      },
    });
  }

  // form
  const [editingId, setEditingId] = useState<undefined | number>();
  const [name, setName] = useState("");
  const [doCreateTag] = useMutation<{ createTag: TagType }>(mutationCreateTag, {
    refetchQueries: [queryTags],
  });
  const [doUpdateTag] = useMutation(mutationUpdateTag, {
    refetchQueries: [queryTags],
  });
  async function doSubmit() {
    try {
      if (editingId !== undefined) {
        await doUpdateTag({
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
        await doCreateTag({
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
  async function onUpdate(tagToUpdate: TagType) {
    setShowEditor(true);
    setName(tagToUpdate.name);
    setEditingId(tagToUpdate.id);
  }

  return (
    <div>
      <h1>Tags</h1>
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
            Nom du tag :
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
      {tags?.map((tag) => (
        <p>
          {tag.name} -{" "}
          <button onClick={() => onDelete(tag.id)}>Supprimer</button>
          <button onClick={() => onUpdate(tag)}>Éditer</button>
        </p>
      ))}
    </div>
  );
}

function Ads() {
  const { data } = useQuery<{ ads: AdType[] }>(queryAds);
  const ads = data?.ads;

  return (
    <div>
      <h1>Annonces</h1>
      {ads?.map((ad) => (
        <Link to={`/ads/${ad.id}`}>
          {ad.title} - {ad.price}€ - Créée par {ad.createdBy?.email}
        </Link>
      ))}
    </div>
  );
}

export function AdminPage() {
  const [view, setView] = useState<undefined | "tags" | "categories" | "ads">();

  return (
    <div>
      <button onClick={() => setView("categories")}>Gérer catégories</button>
      <button onClick={() => setView("tags")}>Gérer tags</button>
      <button onClick={() => setView("ads")}>Gérer annonces</button>
      {view === "categories" && <Categories />}
      {view === "tags" && <Tags />}
      {view === "ads" && <Ads />}
    </div>
  );
}
