import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/axios";
import { UserContext } from "@/context/UserContext";
import PostCard from "../PostCard";
import Loading from "../Loading";
import MainLayout from "../MainLayout";

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { profile } = useContext(UserContext);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/post/get-post/${id}`);
                if (response.status === 200) {
                    setPost(response.data.post);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
                <Loading />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
                <h2 className="text-2xl font-bold text-gray-800">Post Not Found</h2>
                <p className="text-gray-500 mt-2">The post you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <PostCard post={post} />

                {/* Optional: Related posts or back button can go here */}
                <div className="mt-8 flex justify-center pb-10">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Back to Feed
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default PostDetails;
