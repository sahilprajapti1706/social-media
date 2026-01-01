import React, { useContext, useEffect, useState } from "react";
import PostCard from "../PostCard";
import { UserContext } from "@/context/UserContext";
import api from "@/lib/axios";
import MainLayout from "../MainLayout";

const MyLikedPost = () => {
  const { profile } = useContext(UserContext);
  const [myLikedPosts, setMyLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserLikedPost = async () => {
    try {
      const response = await api.get('/post/liked-posts');

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
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Liked Posts</h2>
        <p className="text-muted-foreground text-sm">Posts that caught your eye.</p>
      </div>
      {loading ? (
        <p className="text-center text-muted-foreground py-10 italic">Loading liked posts...</p>
      ) : myLikedPosts.length > 0 ? (
        <div className="space-y-4">
          {myLikedPosts.map((post, idx) => (
            <PostCard key={post._id || idx} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-card p-10 rounded-2xl border border-dashed border-border text-center">
          <p className="text-muted-foreground italic">You haven't liked any posts yet.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default MyLikedPost;
