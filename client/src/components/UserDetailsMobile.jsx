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

const UserDetailsMobile = ({setOpen}) => {
  const { userData, profile , setUserData} = useContext(UserContext);
  const navigate = useNavigate();

  const options = [
  { to: "/home", icon: <Home size={25} />, text: "Home" },
  { to: "/profile", icon: <User size={25} />, text: "My Profile" },
  { to: "/friends", icon: <Users size={25} />, text: "Friends" },
  {
    to: "/my-post",
    icon: <BookOpen size={25} />,
    text: "My Posts",
  },
  {
    to: "/create-post",
    icon: <SquarePen size={25} />,
    text: "Create Post",
  },
  {
    to: "/my-liked-posts",
    icon: <ThumbsUp size={25} />,
    text: "Liked Posts",
  },
  {
    to: "/my-comment-posts",
    icon: <MessageCircle size={25} />,
    text: "My Comments",
  }
]
  if (!profile) return null; // 🚀 Prevents rendering when profile is null

  return (
    <div className="w-full px-4 block lg:hidden z-[99]">
      <Card className="sticky top-[90px]">
        <CardHeader className="flex flex-col items-center">
          {/* Profile Avatar */}
          <Avatar className="h-16 w-16 mb-4">
            <img
              src={profile.profileImage || "./user.png"} // ✅ Uses user's profile image if available
              alt={profile.username || "Profile"}
              className="rounded-full"
            />
          </Avatar>

          {/* Username */}
          <CardTitle className="text-center">
            @{profile.username || "User"}
          </CardTitle>

          {/* Follower & Following Count */}
          <div className="flex justify-around w-full mt-3">
            <div className="flex flex-col items-center">
              <h2 className="text-gray-600 text-base">Follower</h2>
              <h2>{profile.followers?.length || 0}</h2>
            </div>
            <Separator orientation="vertical" className="h-10 bg-gray-300" />
            <div className="flex flex-col items-center">
              <h2 className="text-gray-600 text-base">Following</h2>
              <h2>{profile.following?.length || 0}</h2>
            </div>
          </div>
        </CardHeader>

        <Separator className="w-[70%] mx-auto mb-3" />

        {/* Navigation Links */}
        <CardContent>
          <div className="space-y-2">
            {options.map(({ to, icon, text }, index) => (
              <React.Fragment key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 hover:text-blue-600 transition"
                >
                  {icon}
                  <span>{text}</span>
                </Link>
                {index < 5 && <Separator className="w-[80%] mx-auto mb-2" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsMobile;
