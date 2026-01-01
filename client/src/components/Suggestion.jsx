import React, { useContext, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { UserContext } from "@/context/UserContext";

const Suggestion = () => {
  const { profile } = useContext(UserContext);
  const [userSuggestion, setUserSuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      try {
        const [usersRes, followingRes] = await Promise.all([
          api.get('/user/get-users'),
          api.get('/user/friends'),
        ]);

        if (usersRes.status === 200) {
          // 🔥 Filter out the current user from suggestions
          const filteredUsers = usersRes.data.users.filter(
            (user) => user.username !== profile?.username
          );
          setUserSuggestion(filteredUsers);
        }

        if (followingRes.status === 200) {
          const followingList = followingRes.data.following.reduce((acc, user) => {
            acc[user._id] = true;
            return acc;
          }, {});
          setFollowing(followingList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchUsersAndFollowing();
    }
  }, [token, profile]);

  const handleConnection = async (id) => {
    try {
      const response = await api.post(
        `/user/connection/${id}`,
        {}
      );

      if (response.status === 200) {
        toast({ title: response.data.message });
        setFollowing((prev) => ({ ...prev, [id]: true }));
      }
    } catch (error) {
      console.error("Error connecting with user:", error);
      toast({ title: "Error connecting with user", variant: "destructive" });
    }
  };

  return (
    <Card className="sticky top-[100px] border-none shadow-sm rounded-2xl overflow-hidden bg-card text-card-foreground">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-lg font-bold text-foreground">Suggested For You</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-2 bg-muted/50 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : userSuggestion.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm italic">No new suggestions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userSuggestion.slice(0, 5).map((suggestion, idx) => (
              <div key={suggestion._id} className="group">
                <div className="flex items-center justify-between">
                  {/* Avatar and Username */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <img
                        src={suggestion.profileImage || "./user.png"}
                        alt={suggestion.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">@{suggestion.username}</p>
                      <p className="text-xs text-muted-foreground">Popular</p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <Button
                    size="sm"
                    className={`px-4 py-1 h-8 text-xs font-semibold rounded-full transition-all duration-300 ${following[suggestion._id]
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                      }`}
                    onClick={() => handleConnection(suggestion._id)}
                    disabled={following[suggestion._id]}
                  >
                    {following[suggestion._id] ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>
            ))}
            <button className="w-full mt-4 py-2 text-sm font-semibold text-primary hover:opacity-80 transition-colors">
              View More
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Suggestion;
