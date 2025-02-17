import React, { useContext, useEffect, useState } from "react";
import PostCard from "../PostCard";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import UserDetails from "../UserDetails";

const MyLikedPost = () => {
  const { profile } = useContext(UserContext);
  const [myLikedPosts, setMyLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserLikedPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post/liked-posts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setMyLikedPosts(response.data.likedPosts);
      }
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLikedPost();
  }, []); // Removed unnecessary dependencies

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-6">
          {profile && <UserDetails />}
          <div className="w-full lg:w-5/12 px-4 flex-1 max-w-3xl">
            {loading ? (
              <p className="text-center text-gray-500">Loading posts...</p>
            ) : myLikedPosts.length > 0 ? (
              <div className="space-y-4">
                {myLikedPosts.map((post, idx) => (
                  <PostCard key={post._id || idx} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No liked posts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLikedPost;
