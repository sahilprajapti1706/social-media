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
import api from "@/lib/axios";
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
  const { fetchAllPost, profile } = useContext(UserContext);

  // ✅ Sync comments when post updates
  useEffect(() => {
    setComments(post.comments);
  }, [post]);

  const handleAddComment = async (postId) => {
    if (!token) {
      toast({ title: "Please login to add a comment", variant: "destructive" });
      return;
    }
    if (!newComment.trim()) return; // ✅ Prevent empty comments
    setLoading(true);
    try {
      const response = await api.post(
        `/post/comment/${postId}`,
        { newComment }
      );

      if (response.status === 200) {
        toast({ title: response.data.message });
        setNewComment("");
        await fetchAllPost();
      }
    } catch (error) {
      toast({ title: "Error adding comment", variant: "destructive" });
    } finally {
      setLoading(false); // ✅ Reset loading state
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await api.post(
        `/post/comment/${postId}/${commentId}`,
        {}
      );

      if (response.status === 200) {
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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
        >
          <MessageCircle size={20} />
          <span>{comments.length || 0}</span>
        </button>
      </DrawerTrigger>

      <DrawerContent className="p-4 w-[90%] md:max-w-[40%] mx-auto h-[70vh] bg-card text-card-foreground rounded-lg shadow-lg flex flex-col border-border">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold text-foreground">Comments</DrawerTitle>
          <Separator className="my-1 border-border" />
        </DrawerHeader>

        <div className="space-y-3 overflow-y-auto max-h-96 px-2 py-1 flex-1">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const isCommentAuthor = profile && comment.author && (profile._id === comment.author._id || profile._id === comment.author);
              return (
                <div
                  key={comment._id}
                  className="flex items-center justify-between p-3 bg-muted rounded-xl"
                >
                  {/* Avatar & Username */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={comment.author.profileImage || "./user.png"}
                      alt={comment.author?.username}
                      className="w-10 h-10 rounded-full border border-border"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        @{comment.author?.username}
                      </p>
                      <p className="text-sm text-foreground/90">{comment.content}</p>
                    </div>
                  </div>

                  {/* Delete Comment Dropdown */}
                  {isCommentAuthor && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <EllipsisVertical
                          size={18}
                          className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-popover text-popover-foreground shadow-md rounded-md p-2 border border-border">
                        <DropdownMenuLabel className="p-0">
                          <Button
                            onClick={() =>
                              handleDeleteComment(post._id, comment._id)
                            }
                            className="flex items-center gap-2 w-full justify-start text-red-500 bg-transparent shadow-none hover:bg-red-500/10 hover:text-red-600 transition-all px-3"
                          >
                            <Trash2 size={14} /> Delete
                          </Button>
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4 italic">No comments yet.</p>
          )}
        </div>

        {/* Add New Comment */}
        <div className="mt-4 space-y-4 p-2 border-t border-border pt-4">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20"
            disabled={loading} // ✅ Disable input when loading
          />
          <div className="flex gap-3">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="flex-1 text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleAddComment(post._id)}
              className="flex-1 bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold"
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
