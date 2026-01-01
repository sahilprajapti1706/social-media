import React, { useContext, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { UserContext } from '@/context/UserContext';

const SignIn = () => {
  const { setUserData, setProfile } = useContext(UserContext); // Corrected userData handling
  const [formData, setFormData] = useState({ username: '', password: '' });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/user/login', formData);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);

        // Update context with user data
        const userData = { user: response.data.user };
        setUserData(userData);
        setProfile(response.data.user);

        toast({
          title: response.data.message || "Login successful!",
          variant: "default",
        });

        setFormData({ username: '', password: '' });
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6 transition-colors duration-300">
      <Card className="w-full max-w-md bg-card text-card-foreground border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

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

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline font-medium"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-all font-bold shadow-md active:scale-[0.98]"
            >
              Sign In
            </button>

            {/* Sign Up Redirect */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary font-bold hover:underline">
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
