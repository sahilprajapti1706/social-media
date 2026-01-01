import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Edit, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
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
      const response = await api.put(
        '/user/update-profile',
        { bio }
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
    <div className="min-h-screen bg-transparent p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card text-card-foreground border-border shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
            <div className="flex items-center justify-between pb-3">
              <CardTitle className="text-xl font-bold text-foreground">My Profile</CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="rounded-full border-border hover:bg-muted font-semibold transition-all"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-muted shadow-sm">
                <img
                  src={profile.profileImage || "./user.png"}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-foreground">@{profile.username}</h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {profile.email}
                </p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="bg-muted border-border text-foreground focus:ring-primary/20 rounded-xl resize-none"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-6 hover:opacity-90 transition-all shadow-md">
                  Save Changes
                </Button>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Bio</h3>
                  <p className="text-foreground leading-relaxed">
                    {bio || <span className="italic text-muted-foreground/60">No bio available</span>}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border pt-8">
                  <div className="text-center p-4 bg-muted/40 rounded-2xl border border-border/40">
                    <div className="text-3xl font-black text-primary">
                      {profile.followers?.length || 0}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-muted/40 rounded-2xl border border-border/40">
                    <div className="text-3xl font-black text-primary">
                      {profile.following?.length || 0}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Following</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground/60 border-t border-border pt-6">
                  <span>User Reference</span>
                  <span className="font-mono">{profile._id}</span>
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
