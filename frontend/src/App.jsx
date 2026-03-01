import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Feed from "./components/Feed";
import Profile from "./components/Profile";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const res = await fetch("http://localhost:5000/me", {
        credentials: "include",
      });

      if (res.status === 200) {
        setLoggedIn(true);
      }
    };

  checkLogin();
  }, []);

  return (
    <>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/feed"
          element={loggedIn ? <Feed /> : <Navigate to="/login" />}
        />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;