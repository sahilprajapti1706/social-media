import React, { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, ThumbsUp, SquarePen, BookOpen, LogOut, MessageCircle, HomeIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { UserContext } from '@/context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const UserDetails = () => {
  const { profile, posts } = useContext(UserContext);
  const navigate = useNavigate();

  const trendingTags = Array.from(
    new Set(posts?.flatMap(post => post.tags || []))
  ).slice(0, 8);

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-visible bg-card text-card-foreground">
      <CardHeader className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background pb-6">
        <div className="flex flex-col items-center space-x-4 mb-4">
          <Avatar className="h-20 w-20 mb-4 border-4 border-white dark:border-gray-800 shadow-sm">
            <img
              src={profile?.profileImage || "./user.png"}
              alt={profile?.username || "Profile"}
              className="h-20 w-20 rounded-full object-cover"
            />
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-xl font-bold text-foreground leading-tight">@{profile?.username || "User"}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Member since 2024</p>
          </div>
        </div>

        <div className="flex justify-around items-center border-t border-border pt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile?.followers?.length || 0}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Followers</p>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile?.following?.length || 0}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Following</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        <nav className="space-y-1">
          <Link to="/home" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted hover:text-primary transition-all group">
            <HomeIcon size={20} className="text-muted-foreground group-hover:text-primary" />
            <span className="font-medium">Home Feed</span>
          </Link>

          <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted hover:text-primary transition-all group">
            <User size={20} className="text-muted-foreground group-hover:text-primary" />
            <span className="font-medium">My Profile</span>
          </Link>

          <Link to="/friends" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted hover:text-primary transition-all group">
            <Users size={20} className="text-muted-foreground group-hover:text-primary" />
            <span className="font-medium">Friends</span>
          </Link>

          <Link to="/my-post" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted hover:text-primary transition-all group">
            <BookOpen size={20} className="text-muted-foreground group-hover:text-primary" />
            <span className="font-medium">My Posts</span>
          </Link>

          <Link to="/create-post" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted hover:text-primary transition-all group">
            <SquarePen size={20} className="text-muted-foreground group-hover:text-primary" />
            <span className="font-medium">Create Post</span>
          </Link>

          <Link to="/my-liked-posts" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted hover:text-primary transition-all group">
            <ThumbsUp size={20} className="text-muted-foreground group-hover:text-primary" />
            <span className="font-medium">Liked Posts</span>
          </Link>

          <Link to="/my-comment-posts" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted hover:text-primary transition-all group">
            <MessageCircle size={20} className="text-muted-foreground group-hover:text-primary" />
            <span className="font-medium">My Comments</span>
          </Link>
        </nav>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
