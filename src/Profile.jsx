import { useEffect, useState } from "react";
import axios from "axios";
import Cart from "./Cart";
import Ordered from "./Ordered";
 function Profile() {

  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {

    const fetchProfile = async () => {
      try {

        const userId = localStorage.getItem("userId");

        const res = await axios.get(
          `https://backend-4g4m.onrender.com/api/profile/${userId}`
        );

        setUser(res.data);

      } catch (err) {
        console.log(err);
        setMsg("Failed to load profile");
      }
    };

    fetchProfile();

  }, []);

  if (!user) {
    return <h1 className="p-6">Loading profile...</h1>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      <div className="bg-white shadow-lg rounded-lg p-6">

        <h1 className="text-2xl font-bold mb-4">
          My Profile
        </h1>

        {msg && (
          <p className="text-red-500">{msg}</p>
        )}

        <img
          src={`https://backend-4g4m.onrender.com${user.image}`}
          alt="profile"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />

        <p><strong>Name:</strong> {user.name}</p>
        <p className="mt-2"><strong>Email:</strong> {user.email}</p>
        <p className="mt-2"><strong>Phone:</strong> {user.phone}</p>

      </div>
      <Cart/>
      <Ordered/>
    </div>
  );
}
export default  Profile;
