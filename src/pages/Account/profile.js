import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/pageprops/breadcrumbs";
import toastr from "toastr"; 
import "toastr/build/toastr.min.css"; 

const UserProfile = () => {
  const [user, setUser] = useState({
    email: "",
    fullname: "",
    phone: "",
    address: "",
    state: "",
    bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await axios.post("http://localhost:5000/userinfo", { email });
        if (response.status === 200) {
          setUser(response.data);
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    setPrevLocation(location.state?.data || "Home");
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("http://localhost:5000/saveuser", user, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toastr.options = {
          closeButton: true,
          timeOut: 1200,
        };
        toastr.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error("Failed to update user profile");
      }
    } catch (error) {
      toastr.error("Error updating profile! Please try again."); 
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <Breadcrumbs title="User Profile" prevLocation={prevLocation} />
      <div className="w-full flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 shadow-md rounded-md"> {/* Chiều rộng 70% */}
          <h2 className="text-2xl font-semibold mb-6 text-center">Profile Details</h2>
          <form className="flex flex-col gap-6">
            <div>
              <p className="text-base font-semibold">Full Name</p>
              {isEditing ? (
                <input
                  type="text"
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
              ) : (
                <p className="text-gray-700">{user.fullname || "N/A"}</p>
              )}
            </div>
            <div>
              <p className="text-base font-semibold">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
              ) : (
                <p className="text-gray-700">{user.email || "N/A"}</p>
              )}
            </div>
            <div>
              <p className="text-base font-semibold">Phone</p>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
              ) : (
                <p className="text-gray-700">{user.phone || "N/A"}</p>
              )}
            </div>
            <div>
              <p className="text-base font-semibold">Address</p>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
              ) : (
                <p className="text-gray-700">{user.address || "N/A"}</p>
              )}
            </div>
            <div>
              <p className="text-base font-semibold">State</p>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={user.state}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
              ) : (
                <p className="text-gray-700">{user.state || "N/A"}</p>
              )}
            </div>
            <div>
              <p className="text-base font-semibold">Bio</p>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
              ) : (
                <p className="text-gray-700">{user.bio || "N/A"}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`py-2 px-4 rounded-md ${isEditing ? "bg-red-700 text-white" : "bg-black text-white"}`}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="py-2 px-4 bg-black text-white rounded-md"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
