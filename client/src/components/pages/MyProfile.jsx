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
  const [bio, setBio] = useState(profile?.bio || "");

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
        const updatedProfile = { ...profile, bio };
        setProfile(updatedProfile); 

        toast({
          title: "Profile updated successfully",
        });

        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-full bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto shadow-md">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <img
                  src="./author3.png"
                  alt="Profile"
                  className="h-20 w-20 rounded-full"
                />
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">@{profile?.username}</h2>
                <p className="text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {profile?.email}
                </p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                  <p className="text-gray-700">{profile?.bio || "No bio available"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile?.followers?.length || 0}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile?.following?.length || 0}</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">User ID: {profile?._id}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
