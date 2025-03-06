"use client"
import React, { useState, useEffect } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { PaginationComponent } from "@/app/(main)/ex-warehouse/pagination"
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
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { FilePenLine, Trash } from 'lucide-react';
import LimitSelect from '@/app/(main)/ex-warehouse/limitSelect';
import { Init } from 'v8'



const columnHelper = createColumnHelper()

interface CustomTableProps {
  istableUpdated: number;
}

export default function CustomTable({ istableUpdated }: CustomTableProps) {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);

  // Table Columns
  const columns = [
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer pr-2"
        >
          {column.id.charAt(0).toUpperCase() + column.id.slice(1)}  {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↑"}
        </span>

      ),

      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: ({ column }) => (

        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer pr-2"
        >
          {column.id.charAt(0).toUpperCase() + column.id.slice(1)}   {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↑"}
        </span>
      ),
      // footer: (info) => info.column.id,
      // enableSorting: true, // Enable sorting
      // filterFn: "includes", // Enable search
    }),
    columnHelper.accessor("location", {
      cell: (info) => info.getValue(),
      header: (props) => (
        <span
          onClick={() => props.column.toggleSorting(props.column.getIsSorted() === "asc")}
          className="cursor-pointer pr-2"
        >
          {props.column.id.charAt(0).toUpperCase() + props.column.id.slice(1)}
          {props.column.getIsSorted() === "asc" ? "↑" : props.column.getIsSorted() === "desc" ? "↓" : "↑"}
        </span>
      ),
      // footer: (info) => info.column.id,
      // enableSorting: true, // Enable sorting
      // filterFn: "includes", // Enable search
    }),
    columnHelper.accessor("action", {
      cell: (info: any) => (
        <span className='flex gap-2'>
          <Separator orientation='vertical' className='h-5' />
          <FilePenLine className='text-gray-500 hover:text-gray-200 cursor-pointer'
            onClick={() => {

              toast(`Your are editing id = ${info.row.original.id}  file`, {
                description: "Sunday, December 03, 2023 at 9:00 AM",
              });

            }}
          />
          <Separator orientation='vertical' className='h-5' />
          <Trash className='text-red-300 hover:text-red-700 cursor-pointer'
            onClick={() => {

              toast(`Your id = ${info.row.original.id}  file is deleted`, {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              });

            }}
          />
          <Separator orientation='vertical' className='h-5' />

        </span>
      ),
      header: (props) => <span>{props.column.id.charAt(0).toUpperCase() + props.column.id.slice(1)}</span>,
      // footer: (info) => "",
      // enableSorting: false, // Disable sorting for action column
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting: [{ id: sortField, desc: sortOrder === "desc" }],
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
        `/api/warehouse?page=${page}&limit=${limit}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
    };

    fetchData();
  }, [page, limit, search, sortField, sortOrder,istableUpdated]);

  return (
    <>
      <Table className="gap-4 text-sm">

        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}

        <TableHeader className="hover:rounded-xl">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
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

          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="h-8">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="py-1 text-sm">
                  {(header.id === "action") ?
                    ""
                    :
                    <Input type="text"
                      placeholder={" Search " + header.id}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border p-1 h-[35px]" />
                  }
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} className="h-8">
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className="py-1 text-sm">
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

      </Table>
      <Separator className="my-4" />

      <div className="flex justify-between items-center gap-4">
        <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
        <LimitSelect limit={limit} setLimit={setLimit} />
      </div>

    </>
  );
}
