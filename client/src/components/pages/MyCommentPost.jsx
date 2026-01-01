import React, { useContext, useEffect, useState } from "react";
import PostCard from "../PostCard";
import { UserContext } from "@/context/UserContext";
import api from "@/lib/axios";
import MainLayout from "../MainLayout";

const MyCommentPost = () => {
  const { profile } = useContext(UserContext);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommentedPosts = async () => {
      try {
        const response = await api.get('/post/commented-posts');
        if (response.status === 200) {
          setCommentedPosts(response.data.commentedPosts);
        }
      } catch (error) {
        console.error("Error fetching commented posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommentedPosts();
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Conversations</h2>
        <p className="text-muted-foreground text-sm">Posts where you've shared your thoughts.</p>
      </div>
      {loading ? (
        <p className="text-center text-muted-foreground py-10 italic">Loading commented posts...</p>
      ) : commentedPosts.length > 0 ? (
        <div className="space-y-4">
          {commentedPosts.map((post, idx) => (
            <PostCard key={post._id || idx} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-card p-10 rounded-2xl border border-dashed border-border text-center">
          <p className="text-muted-foreground italic">You haven't commented on any posts yet.</p>
        </div>
      )}
    </MainLayout>
  );
};

export default MyCommentPost;
