import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Edit, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { UserContext } from "@/context/UserContext";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { profile, setProfile } = useContext(UserContext);
  const [bio, setBio] = useState("");

  useEffect(() => {
    setBio(profile?.bio || "");
  }, [profile]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/update-profile`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setProfile((prev) => ({ ...prev, bio }));
        toast({ title: "Profile updated successfully", variant: "default" });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (!profile) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading profile...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto shadow-lg rounded-lg bg-white">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between border-b pb-3">
              <CardTitle className="text-xl font-bold">My Profile</CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <img
                  src={profile.profileImage || "./user.png"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full"
                />
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">@{profile.username}</h2>
                <p className="text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {profile.email}
                </p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium text-gray-500">Bio</h3>
                  <p className="text-gray-700">{bio || "No bio available"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {profile.followers?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {profile.following?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 border-t pt-4">
                  User ID: {profile._id}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
