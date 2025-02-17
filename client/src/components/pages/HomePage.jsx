import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import Feed from "../Feed";
import Suggestion from "../Suggestion";
import UserDetails from "../UserDetails";
import Loading from "../Loading";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const { profile, getUserProfile, userData, fetchAllPost } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (profile !== undefined) {
  //     setLoading(false);
  //   }
  // }, [profile,token]);

  // useEffect(() => {
  //   getUserProfile();
  // }, [token, profile])

  useEffect(() => {
    if (!profile && token) {  // Fetch only if profile is missing
      getUserProfile().finally(() => setLoading(false));
    } else {
      setLoading(false); // Stop loading if profile exists
    }
  }, [token]);  // Removed profile from dependencies

  useEffect(()=> {
    fetchAllPost();
  },[])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-6">
          {profile && <UserDetails />}
          <Feed />
          {profile && <Suggestion />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
