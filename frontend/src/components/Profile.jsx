import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userid") || searchParams.get("userId");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("No user specified");
      return;
    }

    fetch(`http://localhost:5000/profile?user_id=${userId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data);
        }
      })
      .catch(() => setError("Failed to load profile"));
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>User ID: {profile.id}</p>
      <p>Admin: {profile.is_admin ? "Yes" : "No"}</p>
    </div>
  );
}

export default Profile;