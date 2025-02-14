import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User } from 'lucide-react';
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, formData);
      if (response.status === 201) {
        const data = response.data;
        toast({
          title: data.message,
        });
        navigate("/sign-in");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        status: "error",
      });
    }

    setFormData({
      username: '',
      email: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-auto bg-gray-100 flex items-center justify-center p-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
           Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
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

        

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>

            <div className="text-center mt-4">
              <Link
                to={"/sign-in"}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                 <p>Already have an account? <span className='text-blue-700'>Sign in</span> </p>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;