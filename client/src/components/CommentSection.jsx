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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ✅ Fixed import

const CommentSection = ({ post }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { fetchAllPost } = useContext(UserContext);

  // ✅ Sync comments when post updates
  useEffect(() => {
    setComments(post.comments);
  }, [post]);

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return; // ✅ Prevent empty comments
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/comment/${postId}`,
        { newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast({ title: response.data.message });
        setNewComment("");
        await fetchAllPost();
        setIsOpen(false);
      }
    } catch (error) {
      toast({ title: "Error adding comment", variant: "destructive" });
    } finally {
      setLoading(false); // ✅ Reset loading state
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/comment/${postId}/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        toast({ title: response.data.message });
        await fetchAllPost();
      }
    } catch (error) {
      toast({
        title: "Error deleting comment",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer open={isOpen} setIsOpen={setIsOpen}>
      <DrawerTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
        >
          <MessageCircle size={20} />
          <span>{comments.length || 0}</span>
        </button>
      </DrawerTrigger>

      <DrawerContent className="p-4 w-[90%] md:max-w-[40%] mx-auto h-[70vh] bg-white rounded-lg shadow-lg flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">Comments</DrawerTitle>
          <Separator className="my-1" />
        </DrawerHeader>

        <div className="space-y-3 overflow-y-auto max-h-96 px-2 py-1 flex-1">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-center justify-between p-3 bg-gray-200 rounded-xl"
              >
                {/* Avatar & Username */}
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.author.profileImage || "./user.png"}
                    alt={comment.author?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      @{comment.author?.username}
                    </p>
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  </div>
                </div>

                {/* Delete Comment Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical
                      size={18}
                      className="cursor-pointer text-gray-500 hover:text-gray-700"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white shadow-md rounded-md p-2">
                    <DropdownMenuLabel>
                      <Button
                        onClick={() =>
                          handleDeleteComment(post._id, comment._id)
                        }
                        className="flex items-center gap-1 text-red-600"
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* Add New Comment */}
        <div className="mt-4 space-y-2 p-2 border-t pt-4">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled={loading} // ✅ Disable input when loading
          />
          <div className="flex justify-around">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-zinc-600 hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleAddComment(post._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={loading} // ✅ Prevent multiple requests
            >
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentSection;
