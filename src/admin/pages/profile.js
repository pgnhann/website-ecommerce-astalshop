import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export function StaffProfileDialog({ isOpen, onClose }) {
  const [staffInfo, setStaffInfo] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/staff-info/${email}`);
        if (response.ok) {
          const data = await response.json();
          setStaffInfo(data);
        } else {
          toastr.error("Failed to fetch staff info.");
        }
      } catch (error) {
        console.error("Error fetching staff info:", error);
        toastr.error("An error occurred while fetching staff info.");
      }
    };

    if (isOpen) {
      fetchStaffInfo();
    }
  }, [isOpen, email]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-center"> Your Profile</DialogTitle>
        </DialogHeader>
        {staffInfo ? (
          <div className="space-y-4">
            <p><strong>ID:</strong> {staffInfo.id_staff}</p>
            <p><strong>Name:</strong> {staffInfo.name}</p>
            <p><strong>Email:</strong> {staffInfo.email}</p>
            <p><strong>Phone:</strong> {staffInfo.phone}</p>
            <p><strong>Sex:</strong> {staffInfo.sex}</p>
            <p><strong>Position:</strong> {staffInfo.position}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
