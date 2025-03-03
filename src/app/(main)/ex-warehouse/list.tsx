"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";

interface Warehouse {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function ListComponent() {

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  // Fetch warehouses from API
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/warehouse");
      const data: Warehouse[] = await response.json();
      setWarehouses(data);
    }
    fetchData();
  }, []);

  console.log(warehouses);

  return (
    <div>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableHead>Warehouse Name</TableHead>
            <TableHead>Warehouse Location</TableHead>
            {/* <TableHead>Location</TableHead> */}
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
          {warehouses.map((item) => (
            <TableRow
              key={item.id}
              className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
            >
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.location}</TableCell>
              {/* <TableCell>{item.location}</TableCell> */}
              {/* <TableCell>{item.status}</TableCell> */}
              {/* <TableCell className="text-right">{item.balance}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <p className="text-muted-foreground mt-4 text-center text-sm">Table with vertical lines</p> */}
    </div>
  );
}
