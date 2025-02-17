import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Image as ImageIcon } from 'lucide-react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: null, // Added for image file
  });

  const [previewImage, setPreviewImage] = useState(null); // State for preview
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file })); // Update state
      setPreviewImage(URL.createObjectURL(file)); // Create preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.status === 201) {
        toast({ title: response.data.message });
        navigate("/sign-in");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        status: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials and upload a profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Uploed */}
            <div className='flex flex-col justify-center items-center'>
            <label htmlFor="profileImage">
          <img
            className="w-20 h-20 rounded-full self-center object-fill"
            src={!previewImage ? "./upload_area.png" : previewImage}
            alt=""
          />
          <input
            type="file"
            id="profileImage"
            onChange={handleImageChange}
            hidden
          />
        </label>
            </div>
          
              
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

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>

            {/* Already have an account? */}
            <div className="text-center mt-4">
              <Link to={"/sign-in"} className="text-sm text-gray-600 hover:text-gray-800">
                <p>Already have an account? <span className='text-blue-700'>Sign in</span></p>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
