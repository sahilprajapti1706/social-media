import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Our Platform</h1>
        <p className="text-gray-600 text-lg mb-6">
          Get started today and explore exciting features. Create an account or log in to continue.
        </p>
        <div className="flex space-x-4 justify-center">
          <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700" onClick={() => navigate("/sign-up")}>
            Sign Up
          </Button>
          <Button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700" onClick={() => navigate("/sign-in")}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
