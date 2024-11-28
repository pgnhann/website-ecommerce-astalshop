import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/index';
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Trash2, Filter } from 'lucide-react';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import moment from 'moment';

export function CommentManagement() {
  const [comments, setComments] = useState([]); 
  const [filteredComments, setFilteredComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const itemsPerPage = 10; 

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/all-comments");
        const data = await response.json();
        setComments(data);
        setFilteredComments(data); 
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  const handleSort = (criteria) => {
    let sortedComments = [...comments];
    if (criteria === 'type') {
      sortedComments = sortedComments.filter(comment => comment.type === 'Product'); 
    } else if (criteria === 'date') {
      sortedComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    setFilteredComments(sortedComments); 
    setSortBy(null); 
  };


  const handleDeleteComment = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await fetch(`http://localhost:5000/admin/delete-comment/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setComments((prev) => prev.filter((comment) => comment.id_cmt !== id));
          setFilteredComments((prev) => prev.filter((comment) => comment.id_cmt !== id));
          toastr.success("Deleted successfully!");
        } else {
          const errorData = await response.json();
          toastr.error(errorData.error || "Failed to delete comment.");
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        toastr.error("An error occurred while deleting the comment.");
      }
    }
  };

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredComments.slice(startIndex, endIndex);

  return (
    <AdminLayout>
    <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold tracking-tight">Comment Management</h2>
        </div>

        {/* Filter */}
            <div className="flex justify-end items-center mb-4 relative">
            <Button 
                onClick={() => setSortBy(sortBy ? null : 'dropdown')} 
                className="flex items-center bg-blue-500 text-white hover:bg-blue-600"
            >
                <Filter className="mr-1" /> Filter
            </Button>
            {sortBy === 'dropdown' && (
                <div className="absolute top-full right-0 bg-white shadow-lg mt-2 z-10">
                <Button 
                    onClick={() => handleSort('type')} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                    By Type
                </Button>
                <Button 
                    onClick={() => handleSort('date')} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                    By Date
                </Button>
                </div>
            )}
            </div>


        {/* Table */}
        <div className="rounded-md bg-white shadow-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Username</TableHead>
                <TableHead className="text-center">Content</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((comment) => (
                <TableRow key={comment.id_cmt} className="hover:bg-gray-100 transition duration-150">
                  <TableCell className="text-center">{comment.id_cmt}</TableCell>
                  <TableCell className="text-center">{comment.username}</TableCell>
                  <TableCell className="text-justify">{comment.content}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">{comment.type}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{moment(comment.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteComment(comment.id_cmt)}
                    >
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
