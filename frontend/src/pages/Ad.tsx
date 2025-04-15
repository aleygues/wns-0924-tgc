import { useNavigate, useParams } from "react-router-dom";
import { AdType, MessageType } from "../types";
import { useMutation, useQuery } from "@apollo/client";
import { queryAd } from "../api/ad";
import { mutationDeleteAd } from "../api/deleteAd";
import { queryAds } from "../api/ads";
import { queryWhoami } from "../api/whoiam";
import { useEffect, useState } from "react";
import { mutationCreateMessage } from "../api/createMessage";
import { queryMessages } from "../api/messages";
import { useSocket } from "../hooks/socket.hook";

export function AdPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: whoamiData } = useQuery(queryWhoami);
  const me = whoamiData?.whoami;

  const { data } = useQuery<{ ad: AdType }>(queryAd, {
    variables: {
      id,
    },
  });
  const ad = data?.ad;

  const [doDelete] = useMutation(mutationDeleteAd, {
    refetchQueries: [queryAds],
  });
  async function onDelete() {
    try {
      await doDelete({
        variables: {
          id,
        },
      });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  }

  function onUpdate() {
    navigate(`/ads/${id}/edit`);
  }

  const { data: messagesData } = useQuery<{ messages: MessageType[] }>(
    queryMessages,
    {
      variables: {
        adId: id,
      },
      skip: !id,
    }
  );
  const [messages, setMessages] = useState<MessageType[]>();
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  const { socket } = useSocket();
  useEffect(() => {
    const onMessage = (message: MessageType) => {
      // check message ad id before updating
      console.log("We got a new message");
      setMessages([message, ...(messages ?? [])]);
    };
    socket.on("message", onMessage);

    return () => {
      socket.removeListener("message", onMessage);
    };
  }, [messages]);

  const [doCreateMessage] = useMutation(mutationCreateMessage, {
    /* refetchQueries: [queryMessages], */
    // useless because socket already listen for new messages!
  });
  const [message, setMessage] = useState("");
  async function onSendMessage() {
    await doCreateMessage({
      variables: {
        data: {
          content: message,
          ad: { id },
        },
      },
    });
    setMessage("");
  }

  if (ad === undefined) {
    return <p>Chargement</p>;
  }

  return (
    <div>
      <h1>{ad.title}</h1>
      <p>{ad.description}</p>
      <p>{ad.category?.name}</p>
      <p>Créée par {ad.createdBy?.email ?? "(information cachée)"}</p>
      {/* Should be displayed only for admins and author */}
      {(me?.role === "admin" || me?.id === ad.createdBy.id) && (
        <>
          <button onClick={onDelete}>Supprimer l'offre</button>
          <button onClick={onUpdate}>Modifier l'offre</button>
        </>
      )}

      <h1>Chat questions/réponses</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
      >
        <input
          type="text"
          placeholder="Écris ta question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
      {messages ? (
        <>
          <p>{messages.length} messages</p>
          {messages.map((message) => (
            <p>
              {message.content}
              <br />
              <strong>
                Envoyé {new Date(message.createdAt).toLocaleString()} par{" "}
                {message.createdBy.email}
              </strong>
            </p>
          ))}
        </>
      ) : (
        <p>Chargement des messages</p>
      )}
    </div>
  );
}
