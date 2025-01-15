import { useMutation } from "@apollo/client";
import { useState } from "react";
import { mutationCreateUser } from "../api/createUser";

export function SignupPage() {
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("SuperSecret#2025");
  const [error, setError] = useState("");

  const [doCreateUser, { loading, data }] = useMutation(mutationCreateUser);

  async function doSubmit() {
    try {
      await doCreateUser({
        variables: {
          data: {
            email,
            password,
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("password is not strong enough")) {
        setError("Le mot de passe n'est pas assez fort");
      } else if (e.message.includes("email must be an email")) {
        setError("L'email est invalide");
      } else {
        setError("Un compte avec cette adresse email existe déjà");
      }
    }
  }

  if (data) {
    return (
      <div>
        <h2>Inscription</h2>
        <p>Ton compte a été créé 🎉, tu peux te connecter</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Inscription</h2>
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSubmit();
          }}
        >
          <label>
            Email * :
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <br />
          <label>
            Mot de passe * :
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <br />
          <button>M'inscrire</button>
          <br />
          <br />
          {loading === true && <p>Envoi...</p>}
        </form>
      </div>
    </div>
  );
}
