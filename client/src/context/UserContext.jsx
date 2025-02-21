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
        

        try {
            if (!token) return;
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/my-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(response)

           
            
            if(response.status === 200){
                setUserData(response.data);
                setProfile(response.data.user);
            }

        } catch (error) {
            // console.log(error)

            if(error.response.status === 401){
                localStorage.removeItem("token");
                toast({
                    title: "Session Expired!",
                    variant: "default"
                });
                setUserData(null);
                setProfile(null);
                window.location.href = "/";
            }

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
