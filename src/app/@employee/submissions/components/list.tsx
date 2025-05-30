"use client";
import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  PencilLine,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { Icons } from "@/components/ui/icons";

import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Pagination from "@/lib/pagination/index";

interface GarbageAttributes {
  [key: string]: number; // For dynamic properties
}

interface Submission {
  id: string;
  property_id: string;
  client_id: string;
  client_type: string;
  client_name: string;
  borough_name: string;
  street_name: string;
  chute_present: boolean;
  timestamp: string; // ISO 8601 format
  garbage_attributes: GarbageAttributes;
  created_by: string;
  expired: boolean;
}

import { getGarbageSubmissions, deleteGarbageEntry, Params } from "@/services";
import TableSkeleton from "@/components/ui/skeleton/TableSkeleton";
import { timeStamp } from "console";

export default function SubmissionsList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<"timestamp" | "id">("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Submission>(submissions[0]);
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getGarbageSubmissions(1); // Always fetch first page
        const submissionsWithData = updateSubmissionsWithExpiry(data);
        const sortedSubmissions = submissionsWithData.sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA;
        });
        setSubmissions(sortedSubmissions);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch submissions.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const updateSubmissionsWithExpiry = (data: Submission[]) => {
      return data.map((submission) => {
        const submissionTime = Date.parse(submission.timestamp);
        const expiryTime = submissionTime + 24 * 60 * 60 * 1000; // 24 hour in milliseconds
        const expired = Date.now() > expiryTime;
        // Return a new submission object with the calculated expiry
        return { ...submission, expired };
      });
    };

    fetchData();
  }, []); // Remove currentPage dependency

  // Calculate pagination
  const totalPages = Math.ceil(submissions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = submissions.slice(startIndex, endIndex);

  const handleOnPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const formatDate = (timeStamp: string) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcDate = new Date(timeStamp);
    const zonedDate = new TZDate(utcDate, userTimeZone);

    const formattedDate = format(zonedDate, "PPPp");
    return formattedDate;
  };

  const handleSort = (field: "timestamp" | "id") => {
    const order = sortField === field && sortOrder === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortOrder(order);
    const sortedData = [...submissions].sort((a, b) => {
      if (field === "timestamp") {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return order === "desc" ? dateB - dateA : dateA - dateB;
      }
      const valueA = a[field];
      const valueB = b[field];
      if (order === "asc") {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
    setSubmissions(sortedData);
  };

  const openDeleteModal = (submission: Submission) => {
    if (!deleteModalOpen) {
      setDeleteModalOpen(true);
      setSelectedRow(submission);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const deleteEntry = async (submission: Submission) => {
    const params: Params = {
      property_id: submission.property_id,
      client_id: submission.client_id,
      timestamp: submission.timestamp,
      created_by: submission.created_by,
    };
    console.log(params);
    try {
      await deleteGarbageEntry(params);
      setDeleteModalOpen(false);
      toast({
        title: "Deleted",
        description: "Submission deleted successfully",
      });
      setSubmissions(
        submissions.filter(
          (item) => item.property_id !== submission.property_id
        )
      );
    } catch (err) {
      toast({
        title: "Failed",
        description: `${err}: Failed to delete submission, please try again`,
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <TableSkeleton rows={5} />
      </>
    );
  }

  return (
    <>
      <Card className="p-4 mt-4 shadow-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("timestamp")}
                className="flex items-center cursor-pointer"
              >
                Date{" "}
                {sortField === "timestamp" ? (
                  sortOrder === "asc" ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )
                ) : (
                  ""
                )}
              </TableHead>
              {/* <TableHead onClick={() => handleSort("id")} className="cursor-pointer">
                Id {sortField === "id" ? (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown/>) : ""}
                </TableHead> */}
              <TableHead>Client Type</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{formatDate(submission.timestamp)}</TableCell>
                {/* <TableCell>{submission.id}</TableCell> */}
                <TableCell>
                  <Button variant="outline" size="sm">
                    {submission.client_type}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    {submission.client_name}
                  </Button>
                </TableCell>
                <TableCell>
                  {submission.borough_name}, {submission.street_name}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog open={deleteModalOpen}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Ellipsis size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-24">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `submissions/view/${submission.property_id}`
                            )
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Eye size={16} /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={submission.expired}
                          onClick={() =>
                            router.push(
                              `submissions/edit/${submission.property_id}`
                            )
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <PencilLine size={16} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={submission.expired}
                          onClick={() => openDeleteModal(submission)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="link"
                              className="-mx-[14px] -my-2 font-normal hover:no-underline"
                            >
                              <Trash2 size={16} />
                              <span className="pl-2">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => {
                            closeDeleteModal();
                          }}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          disabled={isLoading}
                          onClick={() => {
                            deleteEntry(selectedRow);
                          }}
                        >
                          {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            ""
                          )}
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Pagination
        data={submissions}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleOnPageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
}
