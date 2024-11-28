import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/index';
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { AddProductDialog } from './addproduct'; 
import { UpdateProductDialog } from './updateproduct'; 
import toastr from "toastr";
import "toastr/build/toastr.min.css";


export function ProductManagement() {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const itemsPerPage = 10; 

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productCount, setProductCount] = useState(0);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/all-products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setProductCount(data.length); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const term = e.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.namepro.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); 
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch("http://localhost:5000/admin/add-product", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      setFilteredProducts((prev) => [...prev, addedProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const openUpdateDialog = (product) => {
    setSelectedProduct(product);
    setIsUpdateDialogOpen(true);
  };  

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/update-product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

        const updatedData = await response.json();
        setProducts((prev) =>
          prev.map((product) => (product.idpro === id ? updatedData : product))
        );
        setFilteredProducts((prev) =>
          prev.map((product) => (product.idpro === id ? updatedData : product))
        );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };  

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:5000/admin/delete-product/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts((prev) => prev.filter((product) => product.idpro !== id));
          setFilteredProducts((prev) => prev.filter((product) => product.idpro !== id));
          toastr.success("Deleted successfully!");
          window.location.reload(); 
        } else {
          const errorData = await response.json();
          toastr.error(errorData.error || "Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toastr.error("An error occurred while deleting the product.");
      }
    }
  };

  // Tính toán dữ liệu cho mỗi trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Product Items</h2>
        </div>

       {/* Search Bar */}
          <div className="flex justify-between items-center mb-4">
        
              <input
                  type="text"
                  placeholder="Search by name or category"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
         
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Quantity: {productCount}</span> 
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-black text-white hover:bg-gray-800">
                      Add New
                  </Button>
              </div>

              <AddProductDialog
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)} 
                  onAddProduct={handleAddProduct} 
              />
          </div>

        {/* Table */}
        <div className="rounded-md bg-white shadow-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead className="text-center">Description</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((product) => (
                <TableRow key={product.idpro} className="hover:bg-gray-100 transition duration-150">
                  <TableCell className="font-medium">{product.idpro}</TableCell>
                  <TableCell>
                    <img
                      src={`/images/pros/${product.image}`}
                      alt={product.namepro}
                      className="w-50 h-50 object-cover"
                    />
                  </TableCell>
                  <TableCell className="text-center">{product.namepro}</TableCell>
                  <TableCell className="text-center">{product.category}</TableCell>
                  <TableCell className="text-center">${product.price}</TableCell>
                  <TableCell className="text-center">{product.quantity}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.quantity > 0 ? "default" : "secondary"}>
                      {product.quantity > 0 ? "Yes" : " No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-justify">{product.descr}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50"
                    onClick={() => openUpdateDialog(product)}>
                      <Edit className="h-5 w-5" />
                    </Button>
                    <UpdateProductDialog
                        isOpen={isUpdateDialogOpen}
                        onClose={() => setIsUpdateDialogOpen(false)}
                        product={selectedProduct}
                        onUpdateProduct={handleUpdateProduct}
                      />
                    <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" 
                    onClick={() => handleDeleteProduct(product.idpro)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>

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