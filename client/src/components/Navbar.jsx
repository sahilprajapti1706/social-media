import React, { useContext, useEffect } from "react";
import { List, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { Avatar } from "@radix-ui/react-avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserDetailsMobile from "./UserDetailsMobile";

const Navbar = () => {
  const { profile, userData, setProfile, getUserProfile } =
    useContext(UserContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setProfile(userData?.user);
  }, [userData, token]);

  useEffect(() => {
    getUserProfile();
  }, [token]);

  return (
    <nav className="bg-white border-b border-gray-300 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Section: Mobile Menu & Logo */}
          <div className="flex items-center space-x-2">
            {/* Mobile Sidebar */}
            <div className="lg:hidden">
              <Sheet >
                <SheetTrigger asChild>
                  <List size={25} className="cursor-pointer" />
                </SheetTrigger>
                <SheetContent>
                  <UserDetailsMobile />
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="text-xl font-bold text-blue-600">
              <Link to="/home">VibeVerse</Link>
            </div>
          </div>

          {/* Right Section: Authentication */}
          <div className="flex items-center space-x-8">
            {profile === null ? (
              <p>Loading...</p> 
            ) : profile ? (
              <Link to="/profile">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                    <img
                      src={profile.profileImage || "./user.png"}
                      alt={profile.username || "User"}
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                  <p className="font-medium hidden md:block">
                    {profile.username}
                  </p>
                </div>
              </Link>
            ) : (
              <Link to="/sign-in">
                <Button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-md hover:shadow-lg">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
