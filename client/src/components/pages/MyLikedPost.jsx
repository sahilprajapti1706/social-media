import React, { useContext, useEffect, useState } from 'react'
import PostCard from '../PostCard'
import { UserContext } from '@/context/UserContext'
import axios from 'axios';
import UserDetails from '../UserDetails';

const MyLikedPost = () => {

    const { posts, profile} = useContext(UserContext);
    const [myLikedPosts, setMyLikedPosts] = useState([])

    const getUserLikedPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/liked-posts`,{
          headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        })
  
        if(response.status === 200){
          setMyLikedPosts(response.data.likedPost)
        }
      } catch (error) {
        
      }
    }
  
    useEffect(() => {
      getUserLikedPost()
    },[profile, posts])

    console.log(myLikedPosts);

    
   

  return (
    <>      
          <div className="min-h-auto bg-gray-100">
        <div className="container mx-auto px-4 py-4 pb-4">
          <div className="flex flex-wrap justify-center">
           
            {profile && <UserDetails />}
            <div className="w-full  lg:w-5/12 px-4 flex-1 max-w-3xl">
              <div className="space-y-4">
                {myLikedPosts.map((post, idx) => (
                  <PostCard key={idx} post={post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyLikedPost