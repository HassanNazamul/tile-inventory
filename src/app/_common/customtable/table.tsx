"use client"
import React, { useState, useEffect } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-react';
import { PaginationComponent } from "@/app/_common/customtable/pagination"
import LimitSelect from '@/app/_common/customtable/limitSelect';
import axios from 'axios'
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
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

interface CustomTableProps {
  tableDesc: string,
  url: string,
  columns: Array<object>,
  istableUpdated: number;
}

export default function CustomTable({ tableDesc, url, columns, istableUpdated }: CustomTableProps) {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [columnFilters, setcolumnFilters] = useState({});
  const [columnOrders, setcolumnOrders] = useState({ "id": "desc" });
  const [totalPages, setTotalPages] = useState(1);

  const [timeOutId, setTimeOutId] = useState();
  let [upadteFilterTable, setUpadteFilterTable] = useState(0);

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    // columnResizeMode: "onChange", // Updates size while dragging
    // enableColumnResizing: true, // Enable resizing globally
  });


  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          params: {
            page,
            limit,
            columnFilters: JSON.stringify(columnFilters),
            columnOrders: JSON.stringify(columnOrders),

          },
        });
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    setIsLoading(true);
    fetchData();
    clearTimeout(timeOutId);
  }, [page, limit, columnOrders, upadteFilterTable, istableUpdated]);

  //column filter logic
  const handleColumnFilterChange = (columnId: String) => (e: any) => {
    setcolumnFilters({ ...columnFilters, [columnId]: e.target.value });

    let id = setTimeout(() => {
      console.log("naz table is launched");
      setUpadteFilterTable(++upadteFilterTable);
    }, 2000);
    setTimeOutId(id);
  }

  const handleColumnOrderChange = (columnId: String) => {
    setcolumnOrders({ ...columnOrders, [columnId]: columnOrders[columnId] === "asc" ? "desc" : "asc" });
  }

  return (
    <>
      <Table className="table-fixed w-full">
        <TableHeader className="hover:rounded-xl ">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="py-1 text-sm pl-[5px]" style={{ width: `${header.getSize()}px` }}>

                  <span className='flex justify-left'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {(header.id === "action") ?
                      ""
                      :
                      <span
                        onClick={() => { handleColumnOrderChange(header.id) }}
                        className="cursor-pointer pr-2">
                        {(columnOrders[header.id] ?? "asc") === "desc" ? <ArrowDownNarrowWide className='pb-2 pl-2' /> : <ArrowUpNarrowWide className='pb-2 pl-2' />}
                      </span>
                    }
                  </span>

                  <Input type="text"
                    placeholder={(header.id === "action") ? "Disabled" : " Search " + header.id}
                    value={columnFilters[header.id] || ""}
                    onChange={handleColumnFilterChange(header.id)}
                    disabled={(header.id === "action") ? true : false}
                    className={"border p-1 h-[30px] w-full"} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
      </Table>
      <section className='overflow-y-auto h-[420px] custom-scrollbar'>
        <Table className="table-fixed w-full ">
          <TableCaption>{tableDesc}</TableCaption>
          <TableHeader className="hover:rounded-xl ">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className='h-[1px]' style={{ width: `${header.getSize()}px` }}>

                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading
              ? // Show skeleton loaders when data is loading
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index} className="h-8">
                  {table.getAllColumns().map((column) => (
                    <TableCell key={column.id} className="py-1 text-sm">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
              : // Show actual data when loaded
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="h-8">
                  {row.getVisibleCells().map((cell) => (
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
      </section>

      <Separator className="my-4" />

      <div className="flex justify-between items-center gap-4">
        <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
        <LimitSelect limit={limit} setLimit={setLimit} />
      </div>

    </>
  );
}
