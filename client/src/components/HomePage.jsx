import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import Feed from "./Feed";
import Suggestion from "./Suggestion";
import UserDetails from "./UserDetails";

const HomePage = () => {
  const { profile } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile !== undefined) {
      setLoading(false);
    }
  }, [profile]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-auto bg-gray-100">
      <div className="container mx-auto px-4 py-4 pb-4">
        <div className="flex flex-wrap justify-center">
          {profile ? <UserDetails /> : <p className="text-center"></p>}
          <Feed />
          {profile && <Suggestion />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
