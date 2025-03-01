"use client"
import React, { useState, useEffect } from 'react';
import UserFormModal from './warehouseForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Warehouse {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function ListComponent() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const fetchWarehouses = async () => {
    const response = await fetch("/api/warehouse");
    const data: Warehouse[] = await response.json();
    setWarehouses(data);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  console.log(warehouses);

  return (
    <div>
      <UserFormModal refreshWarehouses={fetchWarehouses} />
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableHead>Warehouse Name</TableHead>
            <TableHead>Warehouse Location</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
