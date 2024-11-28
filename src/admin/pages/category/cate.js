import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/index";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { AddCategoryDialog } from "./addcate"; 
import { UpdateCategoryDialog } from "./updatecate"; 
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import moment from 'moment';

export function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/all-categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenUpdateDialog = (category) => {
    setSelectedCategory(category);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateCategory = async (id, updatedCategory) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/update-category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });

      const updatedData = await response.json();
      setCategories((prev) =>
        prev.map((category) => (category.id_cate === id ? updatedData : category))
      );
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`http://localhost:5000/admin/delete-category/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toastr.success("Deleted successfully!");
          setCategories((prev) => prev.filter((category) => category.id_cate !== id));
        } else {
          const errorData = await response.json();
          toastr.error(errorData.error || "Failed to delete category.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toastr.error("An error occurred while deleting the category.");
      }
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = categories.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
        </div>

        <div className="flex justify-end items-center mb-4">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Add New
          </Button>
          <AddCategoryDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          />
        </div>

        <div className="rounded-md bg-white shadow-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Category ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-center">Updated At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((category) => (
                <TableRow
                  key={category.id_cate}
                  className="hover:bg-gray-100 transition duration-150"
                >
                  <TableCell className="font-medium text-center">{category.id_cate}</TableCell>
                  <TableCell className="text-center">{category.name}</TableCell>
                  <TableCell className="text-center">
                    {moment(category.created_at).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell className="text-center">
                    {moment(category.updated_at).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => handleOpenUpdateDialog(category)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <UpdateCategoryDialog
                      isOpen={isUpdateDialogOpen}
                      onClose={() => setIsUpdateDialogOpen(false)}
                      category={selectedCategory}
                      onUpdateCategory={handleUpdateCategory}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteCategory(category.id_cate)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
