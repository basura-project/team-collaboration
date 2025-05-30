"use client";
import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronsLeft,
  ChevronRightIcon,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the type for the props
interface PaginationProps {
  currentPage: number;
  rowsPerPage: number;
  data: any;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
}

function Pagination(props: PaginationProps) {
  const [page, setPage] = useState(props.currentPage || 0);
  const [rows, setRows] = useState(props.rowsPerPage || 0);
  const [totalItems, setTotalItems] = useState(props.data?.length || 0);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(props.data?.length / props.rowsPerPage)
  );

  const { onPageChange, onRowsPerPageChange } = props;

  // Update internal state when props change
  useEffect(() => {
    setPage(props.currentPage);
    setRows(props.rowsPerPage);
    setTotalItems(props.data?.length || 0);
    setTotalPages(Math.ceil((props.data?.length || 0) / props.rowsPerPage));
  }, [props.currentPage, props.rowsPerPage, props.data]);

  const handlePageChange = (page: number) => {
    setPage(page);
    onPageChange(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: string) => {
    const newRows = parseInt(value, 10);
    setRows(newRows);
    setPage(1);
    onPageChange(1);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRows);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-4 mt-8 text-sm">
      {/* Rows per page dropdown */}
      <div className="text-sm text-gray-500">
        {`1 of ${Math.ceil(totalItems / rows)} selected`}
      </div>
      <div className="flex items-center">
        <div className="flex items-center space-y-0 mr-8">
          <span className="mr-4">Rows per page</span>
          <Select
            onValueChange={handleRowsPerPageChange}
            value={rows.toString()}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={rows.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rows</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem disabled={totalItems < 10} value="10">
                  10
                </SelectItem>
                <SelectItem disabled={totalItems < 15} value="15">
                  15
                </SelectItem>
                <SelectItem disabled={totalItems < 20} value="20">
                  20
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Page information */}
        <div className="mr-8">
          <span>
            Page {page} of {totalPages}
          </span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          {/* First page button */}
          <button
            className="p-2 rounded outline outline-1 outline-gray-300 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => handlePageChange(1)}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page button */}
          <button
            className="p-2 rounded outline outline-1 outline-gray-300 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          {/* Next page button */}
          <button
            className="p-2 rounded outline outline-1 outline-gray-300 disabled:opacity-50"
            disabled={page === totalPages || totalItems < rows}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>

          {/* Last page button */}
          <button
            className="p-2 rounded outline outline-1 outline-gray-300 disabled:opacity-50"
            disabled={page === totalPages || totalItems < rows}
            onClick={() => handlePageChange(totalPages)}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
