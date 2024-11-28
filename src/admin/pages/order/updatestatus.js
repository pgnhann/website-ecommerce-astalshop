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

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Delivering", label: "Delivering" },
  { value: "Shipped", label: "Shipped" },
  { value: "Cancelled", label: "Cancelled" },
];

export function UpdateOrderStatusDialog({ isOpen, onClose, order, onUpdateStatus }) {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");

  const handleStatusChange = async () => {
    if (!order || !order.id_od) return;
  
    try {
      await onUpdateStatus(order.id_od, selectedStatus); 
      toastr.success("Order status updated successfully!");
      onClose(); 
      window.location.reload(); 
    } catch (error) {
      toastr.error("An error occurred while updating the status.");
      console.error("Error updating status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white">
            <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status of the selected order.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
            <div>
                <select
                id="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="" disabled>
                    Select Status
                </option>
                {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                    {status.label}
                    </option>
                ))}
                </select>
            </div>
            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button"  className="mr-2">
                Cancel
                </Button>
            </DialogClose>
            <Button
                onClick={handleStatusChange}
                disabled={!selectedStatus}
                className="bg-black text-white hover:bg-gray-800"
            >
                Update Status
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
  );
}
