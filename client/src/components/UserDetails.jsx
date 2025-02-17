import React, { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, ThumbsUp, SquarePen, BookOpen, LogOut, MessageCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { UserContext } from '@/context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const UserDetails = () => {
  const { userData, profile, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  // console.log(userData)

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUserData(null); 
    toast({
      title : "Sign Out",
    })
    navigate("/");
  };

  return (
    <div className="w-full lg:w-3/12 px-4 hidden lg:block">
      <Card className="sticky top-[90px]">
        <CardHeader>
          <div className="flex flex-col items-center space-x-4 mb-4">
            <Avatar className="h-20 w-20 mb-4 ">
              <img 
                src={profile?.profileImage || "./user.png"} 
                alt={profile?.username || "Profile"}
                className="h-20 w-20 rounded-full"
              />
            </Avatar>
            <div>
              <CardTitle>@{profile?.username || "User"}</CardTitle>
            </div>
          </div>

          <div className="flex justify-around mx-3">
            <CardTitle className="flex flex-col justify-center items-center">
              <h2 className="text-gray-600 text-base">Followers</h2>
              <h2>{profile?.followers?.length || 0}</h2>
            </CardTitle>
            <Separator orientation="vertical" className="h-10 mx-3 bg-gray-500" />
            <CardTitle className="flex flex-col justify-center items-center">
              <h2 className="text-gray-600 text-base">Following</h2>
              <h2>{profile?.following?.length || 0}</h2>
            </CardTitle>
          </div>
        </CardHeader>

        <Separator className="w-[70%] mx-auto mb-3" />
        <CardContent>
          <div className="space-y-2">
            <Link to="/profile" className="flex items-center space-x-3">
              <User size={25} />
              <span>My Profile</span>
            </Link>
            <Separator className="w-[80%] mx-auto mb-3" />
            
            <Link to="/friends" className="flex items-center space-x-3">
              <Users size={25} />
              <span>Friends</span>
            </Link>
            <Separator className="w-[80%] mx-auto mb-3" />

            <Link to="/my-post" className="flex items-center space-x-3">
              <BookOpen size={25} />
              <span>My Posts</span>
            </Link>
            <Separator className="w-[80%] mx-auto mb-3" />

            <Link to="/create-post" className="flex items-center space-x-3">
              <SquarePen size={25} />
              <span>Create Post</span>
            </Link>
            <Separator className="w-[80%] mx-auto mb-3" />

            <Link to="/my-liked-posts" className="flex items-center space-x-3">
              <ThumbsUp size={25} />
              <span>Liked Posts</span>
            </Link>
            <Separator className="w-[80%] mx-auto mb-3" />

            <Link to="/my-comment-posts" className="flex items-center space-x-3">
              <MessageCircle size={25} />
              <span>My Comments</span>
            </Link>
            <Separator className="w-[80%] mx-auto mb-3" />

            <button onClick={handleSignOut} className="flex items-center space-x-3 w-full text-left">
              <LogOut size={25} />
              <span>Sign Out</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
