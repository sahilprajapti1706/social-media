import React, { useContext, useEffect, useState } from "react";
import { List, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { Avatar } from "@radix-ui/react-avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserDetailsMobile from "./UserDetailsMobile";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const { profile, userData, setUserData, setProfile, getUserProfile } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userData?.user) {
      setProfile(userData.user);
    }
  }, [userData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile();
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setProfile(null);
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-300 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Section: Mobile Menu & Logo */}
          <div className="flex items-center space-x-2">
            {profile && (
              <div className="lg:hidden overflow-auto">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <List size={25} className="cursor-pointer" />
                  </SheetTrigger>
                  <SheetContent>
                    <UserDetailsMobile setOpen={setOpen} />
                  </SheetContent>
                </Sheet>
              </div>
            )}
            <div className="text-xl font-bold text-blue-600">
              <Link to="/home">VibeVerse</Link>
            </div>
          </div>

          {/* Right Section: Authentication */}
          <div className="flex items-center space-x-6">
            {profile ? (
              <div className="flex items-center gap-4">
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
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="flex items-center space-x-2 border-none text-red-600 hover:bg-red-100"
                >
                  <LogOut size={20} />
                  <span className="hidden md:block">Sign Out</span>
                </Button>
              </div>
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
