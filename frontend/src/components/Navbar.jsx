import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar({ loggedIn, setLoggedIn }) {
  const [me, setMe] = useState(null);

  const fetchMe = () => {
    fetch("http://localhost:5000/me", {
      credentials: "include",
    })
      .then(res => {
        if (res.status === 401) return null;
        return res.json();
      })
      .then(data => setMe(data));
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchMe();
    }
  }, [loggedIn]);

  const navigate = useNavigate();

  const handleLogout = () => {
    setMe(null);
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3>VulnApp</h3>
      <div>
        {!me && <Link to="/login">Login</Link>}
        {!me && <Link to="/register">Register</Link>}

        {me && <Link to="/feed">Feed</Link>}

        {me && (
          <Link to={`/profile?userid=${me.id}`}>
            My Profile
          </Link>
        )}

        {me && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;