import React, { useContext, useEffect, useState } from 'react'
import PostCard from '../PostCard'
import { UserContext } from '@/context/UserContext'

const MyPost = () => {

    const { posts, setPosts, profile} = useContext(UserContext);
    const [myPosts, setMyPosts] = useState([])

    useEffect(() => {
        if (posts.length > 0 && profile) {
            const filteredPosts = posts.filter(post => post.author._id.toString() === profile._id.toString());
            setMyPosts(filteredPosts);
        }
    }, [posts, profile])

    console.log(myPosts)
   

  return (
    <>      
            <div className="w-full mx-auto mt-6 lg:w-5/12 px-4 flex-1 max-w-3xl">
            
                        <div className="space-y-4">
                          {myPosts.map((post,idx) => (
                            <PostCard key={idx} post={post}/>
                          ))}
                        </div>
              </div>
    </>
  )
}

export default MyPost