import { toast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const getUserProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            setIsInitialized(true);
            return;
        }

        try {
            const response = await api.get('/user/my-profile');

            if (response.status === 200) {
                setUserData(response.data);
                setProfile(response.data.user);
            }

        } catch (error) {
            console.error("Error fetching user profile:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                toast({
                    title: "Session Expired!",
                    description: "Please login again.",
                    variant: "destructive"
                });
                setUserData(null);
                setProfile(null);
            } else {
                toast({
                    title: "Error fetching user",
                    description: error.response?.data?.message || "User Not Found",
                    variant: "destructive"
                });
            }
        }
    };

    const fetchAllPost = async () => {
        try {
            const response = await api.get('/post');
            if (response.status === 200) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            // Error already handled by interceptor
        }
    };

    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    // Initialize user profile on mount only once
    useEffect(() => {
        const initializeUser = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (token) {
                await Promise.all([getUserProfile(), fetchAllPost()]);
            } else {
                await fetchAllPost();
            }

            setLoading(false);
            setIsInitialized(true);
        };

        if (!isInitialized) {
            initializeUser();
        }
    }, [isInitialized]);

    return (
        <UserContext.Provider value={{
            userData,
            setUserData,
            profile,
            setProfile,
            posts,
            getUserProfile,
            fetchAllPost,
            loading,
            searchQuery,
            setSearchQuery,
            filteredPosts
        }}>
            {children}
        </UserContext.Provider>
    );
};
