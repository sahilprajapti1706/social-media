import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const getUserProfile = async () => {
        // if (!token || userData) return; // Prevent unnecessary fetch
        if (!token) return;

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/my-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response.status === 200){
                console.log("Fetched User Data:", response.data); // Debugging
                setUserData(response.data);
                setProfile(response.data.user);
            }
        } catch (error) {
            toast({
                title: "Error fetching user",
                description: error.response?.data?.message || "User Not Found",
                variant: "destructive"
            });
            setUserData(null);
            setProfile(null);
        }
    };

    const fetchAllPost = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post`);
            setPosts(response.data);
        } catch (error) {
            toast({
                title: "Error fetching posts",
                description: error.response?.data?.message || "Failed to fetch posts",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        if (token && !userData) {
            setLoading(true);
            Promise.all([getUserProfile(), fetchAllPost()]).finally(() => setLoading(false));
        }
    }, [token]);  // Removed `profile` to prevent unnecessary calls

    useEffect(() => {
        if (userData) {
            setProfile(userData.user);
        }
    }, [userData]);

    return (
        <UserContext.Provider value={{ 
            token, 
            userData, 
            setUserData, 
            profile, 
            setProfile, 
            posts, 
            getUserProfile,
            fetchAllPost, 
            loading
        }}>
            {children}
        </UserContext.Provider>
    );
};
