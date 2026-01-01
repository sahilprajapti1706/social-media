import React, { useContext, useEffect, useState } from "react";
import PostCard from "../PostCard";
import { UserContext } from "@/context/UserContext";
import MainLayout from "../MainLayout";

const MyPost = () => {
  const { posts, profile } = useContext(UserContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Array.isArray(posts) && profile) {
      const filteredPosts = posts.filter(
        (post) => post.author._id === profile._id || post.author === profile._id
      );
      setMyPosts(filteredPosts);
      setLoading(false);
    }
  }, [posts, profile]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">My Posts</h2>
        <p className="text-muted-foreground text-sm">Everything you've shared with the world.</p>
      </div>
      {loading ? (
        <p className="text-center text-muted-foreground py-10 italic">Loading your posts...</p>
      ) : myPosts.length > 0 ? (
        <div className="space-y-4">
          {myPosts.map((post, idx) => (
            <PostCard key={post._id || idx} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-card p-10 rounded-2xl border border-dashed border-border text-center">
          <p className="text-muted-foreground italic">You haven't posted anything yet.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default MyPost;
