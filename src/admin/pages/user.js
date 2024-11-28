import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/index';
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { AddStaffDialog } from "./addstaff";
import { UpdateStaffDialog } from "./updatestaff";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export function UserManagement() {
  const [users, setUsers] = useState([]); 
  const [userType, setUserType] = useState('Customers'); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 
  const role = localStorage.getItem('role'); 

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchUsers = async (type) => {
    const endpoint = type === 'Customers' ? 'all-customers' : 'all-staff';
    try {
      const response = await fetch(`http://localhost:5000/admin/${endpoint}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  useEffect(() => {
    fetchUsers(userType);
  }, [userType]);

  const handleOpenUpdateDialog = (staff) => {
    setSelectedStaff(staff);
    setIsUpdateDialogOpen(true);
  };
  
  const handleUpdateStaff = async () => {
    await fetchUsers("Staff"); 
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        const response = await fetch(`http://localhost:5000/admin/delete-staff/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toastr.success("Deleted successfully!");
          window.location.reload(); 
        } else {
          const errorData = await response.json();
          toastr.error(errorData.error || "Failed to delete staff.");
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
        toastr.error("An error occurred while deleting the staff.");
      }
    }
  };

  const handleDeleteUser = async (email) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(`http://localhost:5000/admin/delete-customer/${email}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toastr.success("Deleted successfully!");
          window.location.reload(); 
          await fetchUsers("Customers"); 
        } else {
          const errorData = await response.json();
          toastr.error(errorData.error || "Failed to delete customer.");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toastr.error("An error occurred while deleting the customer.");
      }
    }
  };

  
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = users.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        </div>

        {/* Container for Add Button and Checkbox */}
        <div className="flex justify-between items-center mb-4">
            
            {userType === 'Staff' && (
                <Button onClick={() => setIsDialogOpen(true)} className="bg-black text-white hover:bg-gray-800 mr-4">
                    Add New
                </Button>
            )}

            <AddStaffDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />

            {/* User Type Selection */}
            <div className="flex justify-end space-x-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="userType"
                        value="Customers"
                        checked={userType === 'Customers'}
                        onChange={() => setUserType('Customers')}
                        className="cursor-pointer"
                    />
                    <span>Customers</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="userType"
                        value="Staff"
                        checked={userType === 'Staff'}
                        onChange={() => setUserType('Staff')}
                        className="cursor-pointer"
                    />
                    <span>Staff</span>
                </label>
            </div>
        </div>

        {/* Table */}
        <div className="rounded-md bg-white shadow-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                {userType === 'Customers' ? (
                  <>
                    <TableHead className="text-center">Full Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Phone</TableHead>
                    <TableHead className="text-center">Address</TableHead>
                    <TableHead className="text-center">State</TableHead>
                    <TableHead className="text-center">Bio</TableHead>
                    <TableHead className="text-center">Provider</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="text-center">ID Staff</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Phone</TableHead>
                    <TableHead className="text-center">Sex</TableHead>
                    <TableHead className="text-center">Position</TableHead>
                  </>
                )}
                {role === '1' && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((user, index) => (
                <TableRow key={index} className="hover:bg-gray-100 transition duration-150">
                  {userType === 'Customers' ? (
                    <>
                      <TableCell className="font-medium text-center">{user.fullname}</TableCell>
                      <TableCell className="text-center">{user.email}</TableCell>
                      <TableCell className="text-center">{user.phone}</TableCell>
                      <TableCell className="text-center">{user.address}</TableCell>
                      <TableCell className="text-center">{user.state}</TableCell>
                      <TableCell className="text-center">{user.bio}</TableCell>
                      <TableCell className="text-center">{user.provider}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium text-center">{user.id_staff}</TableCell>
                      <TableCell className="text-center">{user.name}</TableCell>
                      <TableCell className="text-center">{user.email}</TableCell>
                      <TableCell className="text-center">{user.phone}</TableCell>
                      <TableCell className="text-center">{user.sex}</TableCell>
                      <TableCell className="text-center">{user.position}</TableCell>
                    </>
                  )}
                  {role === '1' && (
                    <TableCell className="text-center">
                      {/* Nút Edit chỉ hiển thị khi quản lý Staff */}
                      {userType === 'Staff' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => handleOpenUpdateDialog(user)}
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      )}
                        <UpdateStaffDialog
                        isOpen={isUpdateDialogOpen}
                        onClose={() => setIsUpdateDialogOpen(false)}
                        staff={selectedStaff}
                        onUpdateStaff={handleUpdateStaff}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (userType === "Customers") {
                            handleDeleteUser(user.email); 
                          } else {
                            handleDeleteStaff(user.id_staff); 
                          }
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  )}
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
