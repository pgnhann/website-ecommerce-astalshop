import { Button } from '../components/ui/button';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { Input } from '../components/ui/input';
import { FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '../components/ui/dropdown-menu';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useState } from "react";
import { StaffProfileDialog } from "../pages/profile";

export function Header() {
  const [fullname, setFullname] = useState(() => localStorage.getItem("fullname"));
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:5000/logout', { 
            method: 'POST', 
            credentials: 'include' 
        });

        toastr.options = {
          closeButton: true,
          timeOut: 1200,
        };

        if (response.ok) {
            localStorage.clear();
            setFullname(null);
            toastr.success("Logout successfully!", "");
            setTimeout(() => {
              window.location.href = "/";
          }, 800);
        } else {
            toastr.error("Failed to logout. Please try again.", "Error");
        }
    } catch (error) {
        toastr.error("An error occurred during logout. Please try again.", "Error");
        console.error("Logout error:", error);
    }
};

  return (
    <header className="bg-white shadow-sm z-10 w-full">
      <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 flex justify-start px-2">
          <div className="relative max-w-lg w-full">
            <Input
              id="search"
              name="search"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Notification & User Menu */}
        <div className="ml-12 flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
            <Bell className="h-6 w-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700">
                <FaUser className="h-5 w-5" />
                <span className="hidden sm:block">{fullname}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-md shadow-md">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="hover:bg-gray-100"
                onClick={() => setIsProfileOpen(true)}
              >
                Profile
              </DropdownMenuItem>
                <StaffProfileDialog isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

              <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-100">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
