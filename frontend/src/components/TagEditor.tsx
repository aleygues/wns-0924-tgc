import { useState } from "react";
import { useMutation } from "@apollo/client";
import { mutationCreateTag } from "../api/createTag";
import { queryTags } from "../api/tags";

export function TagEditor(props: { onTagCreated: (newId: number) => void }) {
  const [name, setName] = useState("");

  const [doCreateTag] = useMutation(mutationCreateTag, {
    refetchQueries: [queryTags],
  });
  async function doSubmit() {
    try {
      const { data } = await doCreateTag({
        variables: {
          data: {
            name,
          },
        },
      });
      setName("");
      if (data) {
        props.onTagCreated(Number(data.createTag.id));
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
