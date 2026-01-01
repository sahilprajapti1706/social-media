import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Image as ImageIcon } from 'lucide-react';
import api from "@/lib/axios";
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

    if (formData.username.length < 5) {
      toast({
        title: "Username too short",
        description: "Username must be at least 5 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await api.post('/user/register', formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.status === 201) {
        toast({ title: response.data.message });
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 transition-colors duration-300">
      <Card className="w-full max-w-md bg-card text-card-foreground border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Create Account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials and upload a profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className='flex flex-col justify-center items-center'>
              <label htmlFor="profileImage" className="cursor-pointer group relative">
                <div className="w-24 h-24 rounded-full border-4 border-muted overflow-hidden flex items-center justify-center bg-muted transition-all group-hover:border-primary">
                  <img
                    className="w-full h-full object-cover"
                    src={!previewImage ? "./upload_area.png" : previewImage}
                    alt="Profile Preview"
                  />
                  {!previewImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="text-white h-8 w-8" />
                    </div>
                  )}
                </div>
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
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-all font-bold shadow-md active:scale-[0.98]"
            >
              Sign Up
            </button>

            {/* Already have an account? */}
            <div className="text-center mt-4">
              <Link to={"/sign-in"} className="text-sm text-muted-foreground hover:text-foreground group">
                <p>Already have an account? <span className='text-primary font-bold group-hover:underline'>Sign in</span></p>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
