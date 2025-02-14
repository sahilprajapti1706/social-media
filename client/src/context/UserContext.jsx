import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    const token = localStorage.getItem("token")


    const getUserProfile = async() => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/my-profile`,{
            headers :{
                Authorization : `Bearer ${token}`
            }
        })
        if(response.status === 200){
            setUserData(response.data)
        }else{
            toast({
                title : "User Not Found",
                variant : "destructive"
            })
        }
    }
    
    const fetchAllPost = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post`);
            if(response.status === 200){
                
                setPosts(response.data);
                console.log(posts)
            } else {
                toast({
                    title: "Failed to fetch posts",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "An error occurred",
                description: error.message,
                variant: "destructive"
            });
        }
    }
    
    useEffect(() => {
        getUserProfile()
        fetchAllPost()
    },[token])


    // For profile update
    useEffect(() => {
        if (userData) {
          setProfile(userData.user);
        }
      }, [userData]);


    //   Post
    useEffect(()=> {
        // console.log(posts)
    },[posts])


    

    return (
        <UserContext.Provider value={{token, userData, setUserData, profile,setProfile, posts, fetchAllPost }}>
            {children}
        </UserContext.Provider>
    );
};