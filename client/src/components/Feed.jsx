import React, { useContext, useEffect } from 'react'
import PostCard from './PostCard'
import { UserContext } from '@/context/UserContext'

const Feed = () => {

   const {posts, setPosts} = useContext(UserContext);


   
  return (
    <>      
            <div className="w-full lg:w-5/12 px-4 flex-1 max-w-3xl">
            
                        <div className="space-y-4">
                          {posts.map((post,idx) => (
                            <PostCard key={idx} post={post}/>
                          ))}
                        </div>
              </div>
    </>
  )
}

export default Feed