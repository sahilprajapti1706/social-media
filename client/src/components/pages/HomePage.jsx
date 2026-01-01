import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import Feed from "../Feed";
import Loading from "../Loading";
import MainLayout from "../MainLayout";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const { profile, getUserProfile, posts, fetchAllPost } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile && token) {
      getUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllPost();
  }, [])

  // Extract trending tags
  const trendingTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).slice(0, 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <MainLayout>
      <Feed />
    </MainLayout>
  );
};

export default HomePage;
