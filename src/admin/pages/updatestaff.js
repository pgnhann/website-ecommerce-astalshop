import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export function UpdateStaffDialog({ isOpen, onClose, staff, onUpdateStaff }) {
  const [formData, setFormData] = useState({
    idstaff:"",
    name: "",
    email: "",
    phone: "",
    sex: "",
    position: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        idstaff: staff.id_staff,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        sex: staff.sex,
        position: staff.position,
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/admin/update-staff/${staff.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toastr.success("Updated successfully!");
        onUpdateStaff();
        onClose();
        setTimeout(() => {
            window.location.reload();
        }, 2000);
      } else {
        toastr.error("Failed to update the staff. Please try again!");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toastr.error("An error occurred while updating the staff.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Update Staff</DialogTitle>
          <DialogDescription>Update the staff details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            name="idstaff"
            placeholder="ID"
            value={formData.idstaff}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>
        <select
            name="position"
            value={formData.position || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            >
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
        </select>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={onClose} className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Update Staff
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
