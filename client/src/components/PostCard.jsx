import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Heart, MessageCircle, PencilRuler, Send, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import CommentSection from "./CommentSection";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserContext } from "@/context/UserContext";

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [userLikedPosts, setUserLikedPosts] = useState([]);
  const token = localStorage.getItem("token");
  const { fetchAllPost, profile } = useContext(UserContext);
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const isAuthor = profile && post.author && (profile._id === post.author._id || profile._id === post.author);

  useEffect(() => {
    const getUserLikedPost = async () => {
      if (!token) return;
      try {
        const response = await api.get('/post/liked-posts');

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
    if (!token) {
      toast({ title: "Please login to like posts", variant: "destructive" });
      return;
    }
    try {
      const response = await api.post(`/post/like/${post._id}`, {});

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
      const response = await api.delete(`/post/delete/${postId}`);

      if (response.status === 200) {
        toast({ title: response.data.message });
        await fetchAllPost();
        navigate("/home");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error in deleting the post",
        description: error.response?.data?.message || "Failed to delete post",
        variant: "destructive"
      });
    }
  };



  const handleShare = () => {
    const shareUrl = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied to clipboard!" });
  };

  return (
    <Card key={post._id} className="shadow-sm border-border hover:shadow-md transition-shadow duration-300 rounded-xl overflow-hidden bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-border">
              <img
                src={post.author.profileImage || "./user.png"}
                alt={post.author.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Avatar>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">@{post.author.username}</CardTitle>
              <p className="text-xs text-muted-foreground">{dayjs(post.createdAt).fromNow()}</p>
            </div>
          </div>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 hover:bg-muted rounded-full transition-colors outline-none">
                <EllipsisVertical size={20} className="text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover shadow-lg rounded-xl border border-border p-1 min-w-[120px]">
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer">
                  <Link to={`/edit/${post._id}`} className="flex items-center gap-2 px-3 py-2 w-full">
                    <PencilRuler size={16} /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-600 rounded-lg text-red-600 cursor-pointer">
                  <button
                    onClick={() => deletePost(post._id)}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{post.content}</p>

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all ${isLiked ? "bg-red-50 dark:bg-red-900/20 text-red-500" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-sm font-semibold">{likeCount}</span>
            </button>
            <CommentSection post={post} />
          </div>
          <button
            onClick={handleShare}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-all"
            title="Share"
          >
            <Send size={18} />
          </button>
        </div>
      </CardContent>
    </Card>
  );

};

export default PostCard;
