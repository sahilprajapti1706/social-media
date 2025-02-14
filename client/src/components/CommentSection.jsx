import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EllipsisVertical, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { UserContext } from "@/context/UserContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ post }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { fetchAllPost } = useContext(UserContext)

  useEffect(()=> {
    setComments(post.comments)
  }, [post])

    const handleAddComment = async (postId) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/post/comment/${postId}`,
          { newComment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          toast({
            title: response.data.message,
          });
          setNewComment("");
          await fetchAllPost();
          setIsOpen(false);
          navigate("/home")
        }
      } catch (error) {}
    };

    const handleDeleteComment = async (postId, commentId) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/post/comment/${postId}/${commentId}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          toast({
            title: response.data.message,
          });
          
          await fetchAllPost();
          navigate("/home")
        }
      } catch (error) {
        toast({
          title: "Error deleting comment",
          description: error.response?.data?.message || error.message,
          status: "error",
        });
      }
    };
  

  return (
    <Drawer open={isOpen} setIsOpen={setIsOpen}>
      <DrawerTrigger asChild>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
        >
          <MessageCircle size={20} />
          <span>{comments.length || 0}</span>
        </button>
      </DrawerTrigger>

      <DrawerContent className="p-4 w-[90%] md:max-w-[40%] mx-auto h-[70vh] bg-white rounded-lg shadow-lg flex flex-col justify-start ">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">Comments</DrawerTitle>
          <Separator className="my-1" />
        </DrawerHeader>

        <div className="space-y-3 overflow-y-scroll scroll-smooth max-h-96 px-2 py-1 flex-1">
          {comments.length > 0 ? (
            comments.map((comment, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-200 flex-nowrap gap-x-3"
              >
                
                <div className="flex-shrink-0">
                  <img
                    src={comment.author?.avatar || "./author3.png"}
                    alt={comment.author?.username}
                    className="w-10 h-10 rounded-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    @{comment.author?.username}
                  </p>
                  <p className="text-sm text-gray-800 break-words">
                    {comment.content}
                  </p>
                </div>

                <div className="flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical size={18} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-white shadow-md rounded-md p-2">
                      <DropdownMenuLabel>
                        <Button
                          onClick={() => {
                            handleDeleteComment(post._id, comment._id);
                            setIsOpen(false);
                          }}
                          className="flex justify-center items-center gap-1 text-red-600"
                        >
                          <Trash2 size={14} /> Delete
                        </Button>
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* Add New Comment */}
        <div className="mt-4 space-y-2 p-2 border-t pt-4 align-bottom">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <div className="flex justify-around">
            <Button onClick={() => setIsOpen(false)} className="bg-zinc-600 hover:bg-gray-400">
              Cancel
            </Button>
            <Button onClick={() => handleAddComment(post._id)} className="bg-blue-500 hover:bg-blue-600 text-white">
              Post Comment
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentSection;
