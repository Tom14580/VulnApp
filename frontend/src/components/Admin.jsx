import { useState, useEffect } from 'react';

function Admin() {
    const [user_id, setUserId] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState("");

    const deleteUser = async () => {
        setMessage("");
        try {
            const res = await fetch("http://localhost:5000/delete_user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ user_id }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("User deleted successfully");
            } else {
                setMessage(data.error || "Failed to delete user");
            }
        } catch (error) {
            setMessage("Network error: " + error.message);
        }
    }

    const checkAdmin = async () => {
        const res = await fetch("http://localhost:5000/me", {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();
        if (data.is_admin) {
            setIsAdmin(true);
        }
    }

    useEffect(() => {
        checkAdmin();
    }, []);

    if (!isAdmin) {
        return <h2>Access Denied</h2>;
    }
    else {
        return (
        <div className="container">
            <h2>Admin Panel</h2>
            <div className="form-card">
                <input
                    type="text"
                    placeholder="User ID to delete"
                    value={user_id}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={deleteUser}>Delete User</button>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    )
    }
}

export default Admin;