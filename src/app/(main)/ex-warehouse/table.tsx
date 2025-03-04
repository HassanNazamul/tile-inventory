"use client"
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/app/(main)/ex-warehouse/pagination"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button';


const columnHelper = createColumnHelper()



// columnHelper.accessor(row => row.lastName, {
//   id: 'lastName',
//   cell: info => <i>{info.getValue()}</i>,
//   header: () => <span>Last Name</span>,
//   footer: info => info.column.id,
// }),

// columnHelper.accessor('age', {
//   header: () => 'Age',
//   cell: info => info.renderValue(),
//   footer: info => info.column.id,
// })

// ]

export default function CustomTable() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);

  // Table Columns
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: ({ column }) => (
        <>
          <span
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer pr-2"
          >
            ID {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↑"}
          </span>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-1"
          />
        </>
      ),
      // footer: (info) => info.column.id,
      // enableSorting: true, // Enable sorting
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: ({ column }) => (
        <>
          <span
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer pr-2"
          >
            Name {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↑"}
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-1"
          />
        </>
      ),
      // footer: (info) => info.column.id,
      // enableSorting: true, // Enable sorting
      // filterFn: "includes", // Enable search
    }),
    columnHelper.accessor("action", {
      cell: (info) => (
        <span>
          <Button>Edit</Button> <Button variant="destructive">Delete</Button>
        </span>
      ),
      header: () => <span>Action</span>,
      // footer: (info) => "",
      // enableSorting: false, // Disable sorting for action column
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages, // Server-side total pages
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // Enable server-side pagination
    manualSorting: true, // Enable server-side sorting
    state: {
      pagination: { pageIndex: page - 1, pageSize },
      sorting: [{ id: sortField, desc: sortOrder === "desc" }],
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater({ pageIndex: page - 1, pageSize }) : updater;
      setPage(newPagination.pageIndex + 1);
      setPageSize(newPagination.pageSize);
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function"
          ? updater([{ id: sortField, desc: sortOrder === "desc" }])
          : updater;
      setSortField(newSorting[0]?.id || "id");
      setSortOrder(newSorting[0]?.desc ? "desc" : "asc");
    },
  });


  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/warehouse?page=${page}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
    };

    fetchData();
  }, [page, pageSize, search, sortField, sortOrder]);

  return (
    <Table className="gap-4">

      <TableCaption>A list of your recent invoices.</TableCaption>

      <TableHeader className="hover:rounded-xl">
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id} className="w-[7000px]">

                {/* <span className='cursor-pointer p-2 border border-gray-300'
                  onClick={() => {
                    setSortField(header.column.id);
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  🔼🔽
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2"
                />
                <br /> */}
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>

        {table.getRowModel().rows.map(row => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>

      {/* <TableFooter>
        {table.getFooterGroups().map(footerGroup => (
          <TableRow key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <TableCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableFooter> */}

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </Table>
  );
}
