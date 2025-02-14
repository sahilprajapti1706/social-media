import React, { useEffect, useState } from "react";
import axios from "axios";

const Friends = () => {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    fetchFollowData();
  }, []);

  const fetchFollowData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/friends`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.status === 200) {
        setFollowing(response.data.following);
        setFollowers(response.data.followers);
      }
    } catch (error) {
      console.error("Error fetching follow data:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-4xl mx-auto">
      {/* Following Column */}
      <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Following</h2>
        <ul className="space-y-3">
          {following.length > 0 ? (
            following.map((user) => (
              <li key={user._id} className="flex items-center gap-3 border-b pb-2">
                <img
                  src={user.avatar || "./author3.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-700 font-medium">@{user.username}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">You're not following anyone.</p>
          )}
        </ul>
      </div>

      <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Followers</h2>
        <ul className="space-y-3">
          {followers.length > 0 ? (
            followers.map((user) => (
              <li key={user._id} className="flex items-center gap-3 border-b pb-2">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-700 font-medium">@{user.username}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">You have no followers yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Friends;
