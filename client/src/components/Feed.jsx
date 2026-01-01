import React, { useContext, useEffect } from "react";
import PostCard from "./PostCard";
import { UserContext } from "@/context/UserContext";

const Feed = () => {
  const { filteredPosts, fetchAllPost, loading } = useContext(UserContext);
  useEffect(() => {
    fetchAllPost()
  }, [])

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full">
      {/* Check if posts exist */}
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} /> // ✅ Uses post._id as key
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-center font-medium">No posts available.</p>
          <p className="text-gray-400 text-sm">Try searching for something else!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
