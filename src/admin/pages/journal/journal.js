import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/index';
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { AddJournalDialog } from './addjournal';
import { UpdateJournalDialog } from './updatejournal';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import moment from 'moment';

export function JournalManagement() {
  const [journals, setJournals] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/all-journals");
        const data = await response.json();
        setJournals(data);
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchJournals();
  }, []);

  const handleOpenUpdateDialog = (journal) => {
    setSelectedJournal(journal);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateJournal= async (id, updatedJournal) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/update-journal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJournal),
      });

        const updatedData = await response.json();
        setJournals((prev) =>
          prev.map((journal) => (journal.id_jour === id ? updatedData : journal))
        );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }; 

  const handleDeleteJournal = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        const response = await fetch(`http://localhost:5000/admin/delete-journal/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toastr.success("Deleted successfully!");
          window.location.reload(); 
        } else {
          const errorData = await response.json();
          toastr.error(errorData.error || "Failed to delete journal.");
        }
      } catch (error) {
        console.error("Error deleting journal:", error);
        toastr.error("An error occurred while deleting the journal.");
      }
    }
  };

  const totalPages = Math.ceil(journals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = journals.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Journal Management</h2>
        </div>
        
        {/* Add */}
        <div className="flex justify-end items-center mb-4 relative">
        <Button onClick={() => setIsDialogOpen(true)} className="bg-black text-white hover:bg-gray-800">
              Add New
        </Button>
        <AddJournalDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
        </div>

        {/* Table */}
        <div className="rounded-md bg-white shadow-lg">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Journal ID</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Content</TableHead>
                <TableHead className="text-center">Content 1</TableHead>
                <TableHead className="text-center">Content 2</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((journal) => (
                <TableRow key={journal.id_jour} className="hover:bg-gray-100 transition duration-150">
                  <TableCell className="font-medium">{journal.id_jour}</TableCell>
                  <TableCell className="text-center">{journal.title}</TableCell>
                  <TableCell className="text-justify">{journal.content}</TableCell>
                  <TableCell className="text-justify">{journal.content1}</TableCell>
                  <TableCell className="text-justify">{journal.content2}</TableCell>
                  <TableCell className="text-center">{moment(journal.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50"
                     onClick={() => handleOpenUpdateDialog(journal)}>
                      <Edit className="h-5 w-5" />
                    </Button>
                    <UpdateJournalDialog
                        isOpen={isUpdateDialogOpen}
                        onClose={() => setIsUpdateDialogOpen(false)}
                        journal={selectedJournal}
                        onUpdateJournal={handleUpdateJournal}
                      />
                    <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50"
                     onClick={() => handleDeleteJournal(journal.id_jour)}>
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