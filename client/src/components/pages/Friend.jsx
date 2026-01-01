import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import MainLayout from "../MainLayout";

const Friends = () => {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFollowData();
  }, []);

  const fetchFollowData = async () => {
    try {
      const response = await api.get('/user/friends');

      if (response.status === 200) {
        setFollowing(response.data.following || []);
        setFollowers(response.data.followers || []);
      }

    } catch (error) {
      console.error("Error fetching friends data:", error);
      setError("Failed to load friends data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {loading ? (
          <div className="w-full text-center py-20">
            <p className="text-muted-foreground animate-pulse font-medium">Loading your network...</p>
          </div>
        ) : error ? (
          <div className="w-full text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <>
            {/* Following List */}
            <div className="w-full md:w-1/2 bg-card border border-border shadow-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                Following
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{following.length}</span>
              </h2>

              <ul className="space-y-2">
                {following.length > 0 ? (
                  following.map((user) => (
                    <li key={user._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border group">
                      <img
                        src={user.profileImage || "./user.png"}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-sm"
                      />
                      <span className="text-foreground font-bold group-hover:text-primary transition-colors">@{user.username}</span>
                    </li>
                  ))
                ) : (
                  <div className="text-center py-10 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground italic text-sm">You're not following anyone.</p>
                  </div>
                )}
              </ul>
            </div>

            {/* Followers List */}
            <div className="w-full md:w-1/2 bg-card border border-border shadow-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                Followers
                <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">{followers.length}</span>
              </h2>
              <ul className="space-y-2">
                {followers.length > 0 ? (
                  followers.map((user) => (
                    <li key={user._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border group">
                      <img
                        src={user.profileImage || "/default-avatar.png"}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-sm"
                      />
                      <span className="text-foreground font-bold group-hover:text-blue-500 transition-colors">@{user.username}</span>
                    </li>
                  ))
                ) : (
                  <div className="text-center py-10 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground italic text-sm">You have no followers yet.</p>
                  </div>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Friends;
