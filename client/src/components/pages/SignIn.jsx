import React, { useContext, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { UserContext } from '@/context/UserContext';

const SignIn = () => {
  const { setUserData, setProfile } = useContext(UserContext); // Corrected userData handling
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, formData);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user); // Corrected user update
        setProfile(response.data.user); // Corrected user update

        toast({
          title: response.data.message || "Login successful!",
          variant: "default",
        });

        setFormData({ username: '', password: '' });
        navigate("/home");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button 
                type="button" 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>

            {/* Sign Up Redirect */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
