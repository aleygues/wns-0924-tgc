import { useState } from "react";
import { mutationSignin } from "../api/signin";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { queryWhoami } from "../api/whoiam";

export function SigninPage() {
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("SuperSecret#2025");
  const [error, setError] = useState("");

  const [doSignin, { loading }] = useMutation(mutationSignin, {
    refetchQueries: [queryWhoami],
  });

  const navigate = useNavigate();

  async function doSubmit() {
    try {
      const { data } = await doSignin({
        variables: {
          email,
          password,
        },
      });
      if (data.signin) {
        // connected
        console.log(data.signin);
        navigate(`/`, { replace: true });
      } else {
        setError("Impossible de vous connecter");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      setError("Identification échouée");
    }
  }

  return (
    <div>
      <h2>Connexion</h2>
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
          <button>Connexion</button>
          <br />
          <br />
          {loading === true && <p>Envoi...</p>}
        </form>
      </div>
    </div>
  );
}
