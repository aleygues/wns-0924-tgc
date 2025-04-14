import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { PageLayout } from "./components/Layout";
import { AdPage } from "./pages/Ad";
import { AdEditorPage } from "./pages/AdEditor";
import { CategoryPage } from "./pages/Category";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
} from "@apollo/client";
import { SigninPage } from "./pages/Signin";
import { SignupPage } from "./pages/Signup";
import { queryWhoami } from "./api/whoiam";
import { AdminPage } from "./pages/Admin";
import { useEffect } from "react";
import { io } from "socket.io-client";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

enum AuthState {
  user = "user",
  admin = "admin",
  unauthenticated = "unauthenticated",
}

// higher order function
function checkAuth(
  Component: React.FC,
  authStates: AuthState[],
  redirectTo: string = "/"
) {
  // Component Function
  return function () {
    const { data: whoamiData } = useQuery(queryWhoami);
    const me = whoamiData?.whoami;

    if (me === undefined) {
      return null;
    }

    if (
      (me === null && authStates.includes(AuthState.unauthenticated)) ||
      (me && authStates.includes(me.role))
    ) {
      return <Component />;
    }

    return <Navigate to={redirectTo} replace />;
  };
}

function App() {
  useEffect(() => {
    const socket = io("", {
      path: `/api/socket.io`,
      hostname: "",
    });
    socket.on("error", (e) => console.error(e));
    socket.on("disconnect", (e) => console.log("Server disconnected"));
    socket.on("welcome", (message) =>
      console.log("New welcome message =>", message)
    );
    socket.on("message", (message) => console.log("New message =>", message));
  }, []);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route Component={PageLayout}>
            <Route path="/" Component={HomePage} />

            {/* Guest pages */}
            <Route
              path="/signin"
              Component={checkAuth(SigninPage, [AuthState.unauthenticated])}
            />
            <Route
              path="/signup"
              Component={checkAuth(SignupPage, [AuthState.unauthenticated])}
            />

            {/* Admin pages */}
            <Route
              path="/admin"
              Component={checkAuth(AdminPage, [AuthState.admin])}
            />

            {/* User & admin pages */}
            <Route
              path="/ads/:id/edit"
              Component={checkAuth(AdEditorPage, [
                AuthState.user,
                AuthState.admin,
              ])}
            />
            <Route
              path="/ads/new"
              Component={checkAuth(AdEditorPage, [
                AuthState.user,
                AuthState.admin,
              ])}
            />

            {/* Public pages */}
            <Route path="/categories/:id" Component={CategoryPage} />
            <Route path="/ads/:id" Component={AdPage} />
            <Route path="/about" Component={AboutPage} />
            <Route path="*" Component={() => <Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
