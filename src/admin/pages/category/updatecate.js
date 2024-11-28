import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export function UpdateCategoryDialog({ isOpen, onClose, category, onUpdateCategory }) {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toastr.options = { timeOut: "2000" };

    if (!formData.name) {
      toastr.error("Please fill in all required fields!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/admin/update-category/${category.id_cate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toastr.success("Category updated successfully!");
        onUpdateCategory();
        onClose();
        window.location.reload();
      } else {
        toastr.error("Failed to update the category. Please try again!");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toastr.error("An error occurred while updating the category.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={onClose} className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Update Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
