import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Heart, PencilRuler, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import CommentSection from "./CommentSection";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ✅ Fixed Import
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserContext } from "@/context/UserContext";

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [userLikedPosts, setUserLikedPosts] = useState([]);
  const token = localStorage.getItem("token");
  const { fetchAllPost } = useContext(UserContext);
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  useEffect(() => {
    const getUserLikedPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/post/liked-posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUserLikedPosts(response.data.likedPosts);
        }
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    getUserLikedPost();
  }, [token]);

  useEffect(() => {
    setIsLiked(userLikedPosts.some((likedPost) => likedPost._id === post._id));
  }, [userLikedPosts, post._id]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/like/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

        toast({ title: "Success!" });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const deletePost = async (postId) => {
    try {
     ;
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/post/delete/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, 
        }
      );

      if (response.status === 200) {
        toast({ title: response.data.message });
        await fetchAllPost();
        navigate("/home");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Error in deleting the post",
              description :error.response.data.message,
              variant: "destructive" });
    }
  };

  return (
    <Card key={post._id} className="shadow-md rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <img
                src={post.author.profileImage || "./user.png"}
                alt={post.author.username}
                className="h-10 w-10 rounded-full"
              />
            </Avatar>
            <div>
              <CardTitle className="text-md italic">@{post.author.username}</CardTitle>
              <p className="text-xs text-gray-500">{dayjs(post.createdAt).fromNow()}</p>
            </div>
          </div>
  
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={25} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-md rounded-md">
              <DropdownMenuItem>
                <Link to={`/edit/${post._id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                  <PencilRuler size={18} /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => deletePost(post._id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
  
      <CardContent>
        <p className="text-gray-700">{post.content}</p>
  
        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2">
            {/* <p className="font-semibold text-sm text-gray-600">Tags:</p> */}
            <div className="flex flex-wrap gap-2 mt-1">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-300 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
  
        <div className="flex items-center space-x-6 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 text-gray-500 hover:text-red-500 ${isLiked ? "text-red-500" : ""}`}
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
