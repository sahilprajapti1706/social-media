import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Heart, MessageCircle, PencilRuler, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import CommentSection from "./CommentSection";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { UserContext } from "@/context/UserContext";

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [userLikedPosts, setUserLikedPosts] = useState([])
  const token = localStorage.getItem("token");
  const {fetchAllPost} = useContext(UserContext);
  const navigate = useNavigate();
  dayjs.extend(relativeTime);
  

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/like/${postId}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        toast({
          title : "Successfull"
        })
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const getUserLikedPost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/liked-posts`,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      })

      if(response.status === 200){
        setUserLikedPosts(response.data.likedPost)
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getUserLikedPost()
  },[])

  useEffect(() => {
    setIsLiked(userLikedPosts.some(likedPost => likedPost._id.toString() === post._id.toString()));
  }, [userLikedPosts, post]);

  const deletePost = async() => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/post/delete/${post._id}`,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      })

      if(response.status === 201){
        toast({
          title : response.data.message
        })
        await fetchAllPost();
        navigate("/home") 
      }
    } catch (error) {
      console.log(error)
      toast({
        title : "Error in deleting the post"
      })
    }
  }

  return (
    <Card key={post._id}>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <img
                  src="./author3.png"
                  alt={post.author.username}
                  className="rounded-full z-0"
                />
              </Avatar>
              <div>
                <CardTitle className="text-md italic">@{post.author.username}</CardTitle>
                <p className="text-xs text-gray-500">{dayjs(post.createdAt).fromNow()}</p>
              </div>
            </div>
            <div>
            <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical size={25} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-gray-300 mx-2 my-1 shadow-md rounded-md px-2 py-1">
                      <DropdownMenuLabel>
     
                        <Link 
                          to={`/edit/${post._id}`}
                          className="flex justify-center items-center gap-4 px-4 py-1 rounded-md hover:border-2  text-red-600 hover:border-gray-700"
                        >
                          
                          <PencilRuler size={18} /> Edit
                        </Link>
                      </DropdownMenuLabel>
                      
                      <DropdownMenuLabel>
     
                        <Link 
                          onClick={()=> deletePost()}
                          className="flex justify-center items-center gap-1 px-4 py-1 rounded-md hover:border-2  text-red-600 hover:border-gray-700 mb-1"
                        >
                          
                          <Trash2 size={18} /> Delete
                        </Link>
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
            </div>

        </div>
       
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{post.content}</p>
        <div className="flex items-center space-x-6 mt-4">
          <button
            onClick={() => handleLike(post._id)}
            className={`flex items-center space-x-2 hover:text-red-500 text-gray-500  ${
              isLiked ? "text-red-500" : ""
            }`}
          >
            <Heart size={20} fill={isLiked ? "red" : "none"} />
            <span>{likeCount}</span>
          </button>
          <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
            <CommentSection post={post} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
