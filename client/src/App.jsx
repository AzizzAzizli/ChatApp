import Dashboard from "./modules/Dashboard";
import Form from "./modules/Form";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const ProtectedRoutes = ({ children }) => {
    const isLoggedIn = localStorage.getItem("user:token") !== null||true;
    if (!isLoggedIn) {
      return <Navigate to={"/users/sign_in"} />;
    } else if (
      isLoggedIn &&
      ["/users/sign_in", "/users/sign_up"].includes(window.location.pathname)
    ) {
      return <Navigate to={"/"} />;
    }
    return children;
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/users/sign_in"
        element={
          <ProtectedRoutes>
            <Form isSignInPage={true} />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/users/sign_up"
        element={
          <ProtectedRoutes>
            <Form isSignInPage={false} />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;
