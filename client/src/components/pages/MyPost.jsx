import React, { useContext, useEffect, useState } from "react";
import PostCard from "../PostCard";
import { UserContext } from "@/context/UserContext";

const MyPost = () => {
  const { posts, profile } = useContext(UserContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(posts) && profile) {
      const filteredPosts = posts.filter(
        (post) => post.author._id === profile._id
      );
      setMyPosts(filteredPosts);
      setLoading(false);
    }
  }, [posts, profile]);

  return (
    <div className="w-full mx-auto mt-6 lg:w-5/12 px-4 flex-1 max-w-3xl">
      {loading ? (
        <p className="text-center text-gray-500">Loading your posts...</p>
      ) : myPosts.length > 0 ? (
        <div className="space-y-4">
          {myPosts.map((post, idx) => (
            <PostCard key={post._id || idx} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts found.</p>
      )}
    </div>
  );
};

export default MyPost;
