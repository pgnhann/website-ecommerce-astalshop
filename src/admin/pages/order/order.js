import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/index';
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Edit, Eye, Filter } from 'lucide-react';
import { UpdateOrderStatusDialog } from "./updatestatus"
import { OrderDetailDialog } from "./detail"
import moment from 'moment';

export function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [sortBy, setSortBy] = useState(null); 

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderDetails, setOrderDetails] = useState(null); 
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/all-orders");
        const data = await response.json();
        setOrders(data); 
        setFilteredOrders(data); 
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

    const fetchOrderDetails = async (id_od) => {
      try {
        const response = await fetch(`http://localhost:5000/admin/order-details/${id_od}`);
        const data = await response.json();
        setOrderDetails(data); 
        setIsDetailDialogOpen(true); 
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

 
  const handleSort = (criteria) => {
    let sorted;
    if (criteria === 'date') {
      
      sorted = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (criteria === 'amount') {
      
      sorted = [...orders].sort((a, b) => b.totalamount - a.totalamount);
    }
    setFilteredOrders(sorted);
    setSortBy(criteria);
};

  const openUpdateDialog = (order) => {
    setSelectedOrder(order);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateStatus = async (id, status) => {
    console.log("ID Order Select:", id);
    try {
      const response = await fetch(`http://localhost:5000/admin/update-order-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
  
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prev) =>
          prev.map((order) => (order.id_od === id ? updatedOrder : order))
        );
        setFilteredOrders((prev) =>
          prev.map((order) => (order.id_od === id ? updatedOrder : order))
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }; 


  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-4 relative">
          <Button onClick={() => setSortBy(sortBy ? null : 'dropdown')} className="flex items-center bg-blue-500 text-white hover:bg-blue-600">
            <Filter /> Filter
          </Button>
          {sortBy === 'dropdown' && (
            <div className="absolute top-full left-0 bg-white shadow-lg mt-2 z-10">
              <Button onClick={() => handleSort('date')} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Date</Button>
              <Button onClick={() => handleSort('amount')} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Total Amount</Button>
            </div>
          )}
          <Button className="bg-black text-white hover:bg-gray-800">Add New Item</Button>
        </div>

        {/* Table */}
        <div className="rounded-md bg-white shadow-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Order ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Address</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Phone</TableHead>
                <TableHead className="text-center">Subtotal</TableHead>
                <TableHead className="text-center">Total Amount</TableHead>
                <TableHead className="text-center">Payment Method</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Shipping Cost</TableHead>
                <TableHead className="text-center">Note</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((order) => (
                <TableRow key={order.id_od} className="hover:bg-gray-100 transition duration-150">
                  <TableCell className="font-medium">{order.id_od}</TableCell>
                  <TableCell className="text-center">{order.name}</TableCell>
                  <TableCell className="text-center">{order.address}</TableCell>
                  <TableCell className="text-center">{order.email}</TableCell>
                  <TableCell className="text-center">{order.phone}</TableCell>
                  <TableCell className="text-center">${order.subtotal}</TableCell>
                  <TableCell className="text-center">${order.totalamount}</TableCell>
                  <TableCell className="text-center">{order.paymethod}</TableCell>
                  <TableCell className="text-center">{order.status}</TableCell>
                  <TableCell className="text-center">${order.shipcost}</TableCell>
                  <TableCell className="text-center">{order.note}</TableCell>
                  <TableCell className="text-center">{moment(order.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50"
                      onClick={() => openUpdateDialog(order)}>
                      <Edit className="h-5 w-5" />
                    </Button>
                    <UpdateOrderStatusDialog
                      isOpen={isUpdateDialogOpen}
                      onClose={() => setIsUpdateDialogOpen(false)}
                      order={selectedOrder}
                      onUpdateStatus={handleUpdateStatus}/>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-50"
                      onClick={() => fetchOrderDetails(order.id_od)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <OrderDetailDialog
                      isOpen={isDetailDialogOpen}
                      onClose={() => setIsDetailDialogOpen(false)}
                      orderDetails={orderDetails}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}