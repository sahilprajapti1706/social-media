import React, { useContext, useState } from "react";
import { Menu, X, User, ChevronDown, Search, Bell, List } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { Avatar } from "@radix-ui/react-avatar";
import {Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UserDetailsMobile from "./UserDetailsMobile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { profile } = useContext(UserContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-300 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
                <div className="flex items-center space-x-2">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                        <List size={25} onClick={toggleMenu} className="cursor-pointer" />
                    </SheetTrigger>

                    <SheetContent>
                      <div>
                          <UserDetailsMobile/>
                      </div>
                      
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="text-xl font-bold text-blue-600" >
                  <Link to={"/home"}>
                  VibeVerse
                  </Link>
                </div>
                </div>

               
          <div className="flex items-center space-x-8">

           
            {!profile ? (
              <>
                <Link to={"/sign-in"}>
                  <Button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-md hover:shadow-lg">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </>
            ) : (
              <Link to={"/profile"}>
                <div className="block md:flex gap-2 justify-center items-center">
                  <Avatar className="h-6 w-6 md:h-8 md:w-8">
                    <img
                      src="./author3.png"
                      alt={profile.username}
                      className="rounded-full"
                    />
                  </Avatar>
                  <p className="font-medium hidden md:block">{profile.username}</p>
                </div>
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
