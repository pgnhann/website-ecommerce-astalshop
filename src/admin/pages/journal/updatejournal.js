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

export function UpdateJournalDialog({ isOpen, onClose, journal, onUpdateJournal }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content1: "",
    content2: "",
  });

  useEffect(() => {
    if (journal) {
      setFormData({
        title: journal.title,
        content: journal.content,
        content1: journal.content1,
        content2: journal.content2,
      });
    }
  }, [journal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toastr.options = { timeOut: "2000" };

    try {
      const response = await fetch(`http://localhost:5000/admin/update-journal/${journal.id_jour}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toastr.success("Updated successfully!");
        onUpdateJournal();
        onClose();
        window.location.reload();
      } else {
        toastr.error("Failed to update the journal. Please try again!");
      }
    } catch (error) {
      console.error("Error updating journal:", error);
      toastr.error("An error occurred while updating the journal.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Update Journal</DialogTitle>
          <DialogDescription>
            Update the journal details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="content"
            placeholder="Content"
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
              Update Journal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}