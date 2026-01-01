import React, { useContext, useEffect, useState } from "react";
import { List, LogOut, User, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "@radix-ui/react-avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserDetailsMobile from "./UserDetailsMobile";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const { profile, userData, setUserData, setProfile, searchQuery, setSearchQuery } =
    useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userData?.user) {
      setProfile(userData.user);
    }
  }, [userData]);

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
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Section: Mobile Menu & Logo */}
          <div className="flex items-center space-x-2 flex-grow sm:flex-grow-0">
            {profile && (
              <div className="lg:hidden overflow-auto">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <List size={25} className="cursor-pointer text-foreground" />
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-background border-border">
                    <UserDetailsMobile setOpen={setOpen} />
                  </SheetContent>
                </Sheet>
              </div>
            )}
            <div className="text-xl font-bold text-primary min-w-fit">
              <Link to="/home" className="flex items-center gap-2">
                <span className="hidden xs:inline">VibeVerse</span>
                <span className="xs:hidden">VV</span>
              </Link>
            </div>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="flex-grow max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts, users, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-border rounded-full bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
              <div className="absolute right-3 top-2.5 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section: Authentication */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 hover:bg-muted transition-colors outline-none"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500 hover:text-yellow-400" />
              )}
            </Button>

            {profile ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link to="/profile">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-full overflow-hidden border border-border">
                      <img
                        src={profile.profileImage || "./user.png"}
                        alt={profile.username || "User"}
                        className="object-cover w-full h-full"
                      />
                    </Avatar>
                    <p className="font-medium hidden lg:block text-foreground/80 hover:text-foreground transition-colors">
                      {profile.username}
                    </p>
                  </div>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="flex items-center space-x-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 p-2 sm:px-4 sm:py-2 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                  <span className="hidden md:block">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/sign-in">
                  <Button variant="ghost" className="text-foreground hover:bg-muted rounded-xl transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" className="hidden xs:block">
                  <Button className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm border-none rounded-xl transition-all px-6">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans text-sm transition-all"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
