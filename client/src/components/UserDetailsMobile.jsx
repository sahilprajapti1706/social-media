import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  BookOpen,
  SquarePen,
  ThumbsUp,
  MessageCircle,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

const UserDetailsMobile = ({ setOpen }) => {
  const { profile } = useContext(UserContext);

  const options = [
    { to: "/home", icon: <Home size={20} />, text: "Home Feed" },
    { to: "/profile", icon: <User size={20} />, text: "My Profile" },
    { to: "/friends", icon: <Users size={20} />, text: "Friends List" },
    { to: "/my-post", icon: <BookOpen size={20} />, text: "My Posts" },
    { to: "/create-post", icon: <SquarePen size={20} />, text: "Create New Post" },
    { to: "/my-liked-posts", icon: <ThumbsUp size={20} />, text: "Liked Posts" },
    { to: "/my-comment-posts", icon: <MessageCircle size={20} />, text: "My Comments" },
  ];

  if (!profile) return null;

  return (
    <div className="w-full flex flex-col h-full bg-white">
      <div className="flex flex-col items-center py-8 bg-gradient-to-b from-blue-50 to-white pt-[50px]">
        <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
          <img
            src={profile.profileImage || "./user.png"}
            alt={profile.username || "Profile"}
            className="rounded-full object-cover"
          />
        </Avatar>
        <CardTitle className="text-xl font-bold text-gray-900">
          @{profile.username || "User"}
        </CardTitle>

        <div className="flex justify-around w-full mt-6 px-4">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{profile.followers?.length || 0}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Followers</p>
          </div>
          <div className="h-10 w-px bg-gray-100"></div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{profile.following?.length || 0}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Following</p>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-50" />

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {options.map(({ to, icon, text }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all group"
          >
            <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
              {icon}
            </span>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600">
              {text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserDetailsMobile;
