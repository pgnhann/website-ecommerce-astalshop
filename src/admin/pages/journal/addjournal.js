import React, { useState } from "react";
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

export function AddJournalDialog({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content1: "",
    content2: "",
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

 
    if (!formData.title || !formData.content) {
      toastr.error("Please fill in all required fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/admin/add-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toastr.success("Added successfully!");
        onClose(); 
        window.location.reload(); 
      } else {
        toastr.error("Failed to add journal. Please try again!");
      }
    } catch (error) {
      console.error("Error adding journal:", error);
      toastr.error("An error occurred while adding the journal!");
    }

   
    setFormData({
      title: "",
      content: "",
      content1: "",
      content2: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Journal</DialogTitle>
          <DialogDescription>
            Please fill in the details of the new journal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Journal Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="content"
            placeholder="Main Content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-md"
          ></textarea>
          <textarea
            name="content1"
            placeholder="Additional Content 1"
            value={formData.content1}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-md"
          ></textarea>
          <textarea
            name="content2"
            placeholder="Additional Content 2"
            value={formData.content2}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-md"
          ></textarea>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={onClose} className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Add Journal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
