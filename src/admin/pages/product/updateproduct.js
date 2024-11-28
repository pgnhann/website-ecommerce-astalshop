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

export function UpdateProductDialog({ isOpen, onClose, product, onUpdateProduct }) {
  const [formData, setFormData] = useState({
    namepro: "",
    image: null,
    category: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        namepro: product.namepro,
        image: product.image,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        description: product.descr,
      });
      setPreviewImage(`/images/pros/${product.image}`);
    }
  }, [product]);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toastr.options = { timeOut: "2000" };

    const formDataToSend = new FormData();
    formDataToSend.append("namepro", formData.namepro);
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("description", formData.description);
    try {
      const response = await fetch(`http://localhost:5000/admin/update-product/${product.idpro}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        toastr.success("Updated successfully!");
        onUpdateProduct();
        onClose();
        window.location.reload();
      } else {
        toastr.error("Failed to update the product. Please try again!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toastr.error("An error occurred while updating the product.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Update the product details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="namepro"
            placeholder="Product Name"
            value={formData.namepro}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />

          <div className="space-y-2">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {previewImage && (
              <div className="flex items-center space-x-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <span>{formData.image?.name || product.image}</span>
              </div>
            )}
          </div>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((cate) => (
              <option key={cate.id_cate} value={cate.name}>
                {cate.name}
              </option>
            ))}
          </select>

          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
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
              Update Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


