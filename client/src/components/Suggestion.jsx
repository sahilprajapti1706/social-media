import React, { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const Suggestion = () => {
  const [userSuggestion, setUserSuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState({}); 

  const getUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/get-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setUserSuggestion(response.data.users);
        checkAlreadyFollowing(); 
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAlreadyFollowing = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/friends`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const followingList = response.data.following.reduce((acc, user) => {
          acc[user._id] = true;
          return acc;
        }, {});
        setFollowing(followingList);
      }
    } catch (error) {
      console.error("Error fetching following list:", error);
    }
  };

  const handleConnection = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/connection/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: response.data.message,
        });

        setFollowing((prev) => ({ ...prev, [id]: true })); 
      }
    } catch (error) {
      console.error("Error connecting with user:", error);
      toast({
        title: "Error connecting with user",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="w-full lg:w-3/12 px-4 hidden xl:block">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Suggested Connections</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading suggestions...</p>
          ) : userSuggestion.length === 0 ? (
            <p className="text-gray-500">No suggestions available.</p>
          ) : (
            <div className="space-y-3">
              {userSuggestion.map((suggestion, idx) => (
                <div key={suggestion._id}>
                  <div className="flex items-center justify-between">
                    {/* Avatar and Username */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <img
                          src={suggestion.avatar || "./author3.png"}
                          alt={suggestion.username}
                          className="rounded-full"
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">@{suggestion.username}</p>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <Button
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => handleConnection(suggestion._id)}
                      disabled={following[suggestion._id]}
                    >
                      {following[suggestion._id] ? "Following" : "Follow"}
                    </Button>
                  </div>

                  {idx < userSuggestion.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Suggestion;
