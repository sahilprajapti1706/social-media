import React, { useContext, useEffect } from "react";
import PostCard from "./PostCard";
import { UserContext } from "@/context/UserContext";

const Feed = () => {
  const { posts, fetchAllPost, setPosts } = useContext(UserContext);
  useEffect(()=>{
    fetchAllPost()
  },[])

  return (
    <div className="w-full lg:w-5/12 px-4 flex-1 max-w-3xl">
      {/* Check if posts exist */}
      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} /> // ✅ Uses post._id as key
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No posts available.</p> // ✅ Handles empty posts case
      )}
    </div>
  );
};

export default Feed;
