import React, { useState } from "react";
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

export function AddStaffDialog({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    idstaff: "",
    name: "",
    email: "",
    phone: "",
    sex: "",
    position: "",
    password: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toastr.options = {
      timeOut: "2000",
    };

    // Validate dữ liệu
    if (!formData.idstaff || !formData.name || !formData.email || !formData.phone || 
        !formData.sex || !formData.position || !formData.password) {
      toastr.error("Please fill in all required fields!");
      return;
    }    

    try {
      const response = await fetch("http://localhost:5000/admin/add-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toastr.success("Staff added successfully!");
        onClose();
        window.location.reload();
      } else {
        toastr.error("Failed to add staff. Please try again!");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      toastr.error("An error occurred while adding the staff!");
    }
    setFormData({
        idstaff: "",
        name: "",
        email: "",
        phone: "",
        sex: "",
        position: "",
        password: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogDescription>
            Please fill in the details of the new staff member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            name="idstaff"
            placeholder="ID Staff"
            value={formData.idstaff}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
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
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Position</option>
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
              Add Staff
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
