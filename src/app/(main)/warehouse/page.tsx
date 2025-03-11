"use client";
import React, { useState } from "react";
import CustomDrawer from "@/app/(main)/warehouse/drawer"
import CustomSheet from "@/app/(main)/warehouse/sheet"
import CustomTable from "@/app/_common/customtable/table"
import { FilePenLine, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import {
    createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper()


export default function Page() {

    const [istableUpdated, setIstableUpdated] = useState(1);

    const [selectedIdData, setSelectedIdData] = useState<object | null>({
        id: 0,
        name: "",
        location: "",
    }); // Store the selected row ID

    const [isSheetOpen, setIsSheetOpen] = useState(false); // Control sheet visibility

    // Table Columns
    const columns = [
        columnHelper.accessor("id", {
            header: ({ column }) => column.id.charAt(0).toUpperCase() + column.id.slice(1),
            cell: (info) => info.getValue(),
            size: 20,
            enableResizing: true, // Allow resizing
        }),
        columnHelper.accessor("name", {
            cell: (info) => info.getValue(),
            header: ({ column }) => column.id.charAt(0).toUpperCase() + column.id.slice(1),
            size: 100

            // footer: (info) => info.column.id,
            // enableSorting: true, // Enable sorting
            // filterFn: "includes", // Enable search
        }),
        columnHelper.accessor("location", {
            cell: (info) => info.getValue(),
            header: (props) => props.column.id.charAt(0).toUpperCase() + props.column.id.slice(1),
            size: 100

            // footer: (info) => info.column.id,
            // enableSorting: true, // Enable sorting
            // filterFn: "includes", // Enable search
        }),
        columnHelper.accessor("action", {
            header: (props) => <span>{props.column.id.charAt(0).toUpperCase() + props.column.id.slice(1)}</span>,
            cell: (info: any) => (
                <span className='flex gap-2'>
                    <Separator orientation='vertical' className='h-5' />
                    <FilePenLine className='text-gray-500 hover:text-gray-200 cursor-pointer'
                        onClick={() => {

                            toast(`Your are editing id = ${info.row.original.id}  file`, {
                                description: "Sunday, December 03, 2023 at 9:00 AM",
                            });

                            // set the row data to the state
                            setSelectedIdData( {
                                id: info.row.original.id,
                                name: info.row.original.name,
                                location: info.row.original.location,
                            }); // Set the sele
                            setIsSheetOpen(true); // Open the CustomSheet
                            console.log("info", info.row.original.name);
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
            size: 20

            // footer: (info) => "",
            // enableSorting: false, // Disable sorting for action column
        }),
    ];


    return (
        <div className="flex flex-col gap-4 p-4 pt-0">

            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-8 sd:grid-cols-4 xsd:grid-cols-2">
                <div className="rounded-xl bg-muted/50 p-2">
                    <CustomDrawer />
                </div>
                <div className="rounded-xl bg-muted/50 p-2">
                    <CustomSheet istableUpdated={istableUpdated} setIstableUpdated={setIstableUpdated} />
                </div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
            </div> */}

            <div className="flex-1 rounded-xl bg-muted/50 p-2">
                <div className="flex gap-4 justify-end">
                    <CustomDrawer />

                    {/* Button to Open Sheet */}
                    <Button variant="outline"
                        onClick={() => {
                            setSelectedIdData({
                                id: 0,
                                name: "",
                                location: "",
                            });
                            setIsSheetOpen(true);
                        }}
                    >Add Warehouse</Button>
                </div>
                <CustomTable tableDesc="A list of your warehouses." url="/api/warehouse" columns={columns} istableUpdated={istableUpdated} />
            </div>

            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>

            <div className="flex-1 rounded-xl bg-muted/50 p-2">
                <CustomTable />
            </div>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>

            <div className="flex-1 rounded-xl bg-muted/50 p-2">
                <CustomTable />
            </div> */}
            <CustomSheet
                istableUpdated={istableUpdated}
                setIstableUpdated={setIstableUpdated}
                selectedIdData={selectedIdData} // Pass the selected ID
                isOpen={isSheetOpen} // Control sheet visibility
                onClose={() => setIsSheetOpen(false)} // Close sheet function
                setSelectedIdData = {setSelectedIdData}
            />
        </div>
    )
}
