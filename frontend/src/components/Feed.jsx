import { useEffect, useState } from "react";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:5000/posts", {
      credentials: "include",
    });

    const data = await res.json();
    setPosts(data.posts); 
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    await fetch("http://localhost:5000/create_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    setContent("");
    fetchPosts();
  };

  return (
    <div className="container">
      <h2>Feed</h2>

      <div className="form-card">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={createPost}>Post</button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="post">
          <strong>{post.username}</strong>
          <p dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      ))}
    </div>
  );
}

export default Feed;