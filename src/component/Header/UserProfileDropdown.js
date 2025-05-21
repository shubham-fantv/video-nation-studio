import React, { useState } from "react";
import { ChevronDown, LogOut, User, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import logout from "../../utils/logout";

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { userData } = useSelector((state) => state.user);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* User profile button */}
      <button
        onClick={toggleDropdown}
        style={{ border: "1px solid #262626" }}
        className="flex items-center space-x-2 rounded-xl h-[40px]  p-1 md:p-2 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <img
          src={userData?.profilePicture}
          alt={userData?.name || "User"}
          className="h-8 w-8 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/icons/user.png";
          }}
        />
        <span className="font-medium text-gray-700 truncate">{userData.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeDropdown} />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-500 truncate">{userData.email}</p>
                </div>
              </div>

              <hr className="my-1 border-gray-200" />

              <a
                href="/"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="mr-2 h-4 w-4 text-gray-500" />
                Profile
              </a>

              <button
                onClick={() => logout()}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileDropdown;
