import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 max-w-lg w-full text-center">
        
        {/* App Name / Branding */}
        <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-2">
          VibeVerse
        </div>

        {/* Welcome Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Welcome to VibeVerse
        </h1>

        {/* Short Description */}
        <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
          Connect, share, and explore exciting features. 
          Create an account or log in to continue your journey.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 justify-center">
          <Button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </Button>
          <Button 
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300 w-full sm:w-auto"
            onClick={() => navigate("/sign-in")}
          >
            Login
          </Button>
        </div>

        {/* Continue Without Account */}
        <div className="flex justify-center mt-4">
          <Link to={"/home"} className="flex space-x-2 items-center text-blue-600 hover:text-blue-700 transition">
            <span className="">Continue without account</span> 
            <ArrowRight size={20}/>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
