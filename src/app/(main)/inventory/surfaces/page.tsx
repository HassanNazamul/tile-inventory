"use client";
import React, { useState } from "react";
// import CustomDrawer from "./drawer"
import CustomSheet from "./sheet"
import CustomTable from "@/app/_common/customtable/table"
import { FilePenLine, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import {
    createColumnHelper,
} from '@tanstack/react-table';
import ConfirmComponent from '@/app/_common/popup/confirmpopup';
import axios from "axios";

const columnHelper = createColumnHelper()

interface sheetDataInterface {
    id: number,
    name: string
}

export default function Page() {

    const url = "/api/inventory/surfaces";

    const [istableUpdated, setIstableUpdated] = useState(1);

    const [sheetData, setSheetData] = useState<sheetDataInterface>({
        id: 0,
        name: ""
    }); // Store the selected row ID

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isConfirmAlert, setIsConfirmAlert] = useState(false);

    const [alertData, setAlertData] = useState<(() => Promise<void>) | null>(null);

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
        columnHelper.accessor("createdAt", {
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
                    <FilePenLine className='text-gray-500 hover:text-gray-200 cursor-pointer min-h-4 min-w-4'
                        onClick={() => {

                            toast(`Your are editing id = ${info.row.original.id}  file`, {
                                description: "Sunday, December 03, 2023 at 9:00 AM",
                            });

                            // set the row data to the state
                            setSheetData({
                                id: info.row.original.id,
                                name: info.row.original.name
                            }); // Set the sele
                            setIsSheetOpen(true); // Open the CustomSheet
                            console.log("info", info.row.original.name);
                        }}
                    />
                    <Separator orientation='vertical' className='h-5' />
                    <Trash className='text-red-300 hover:text-red-700 cursor-pointer min-h-4 min-w-4'
                        onClick={() => {

                            setAlertData(() => async () => {
                                try {
                                    const response = await axios.delete(url, {
                                        headers: { "Content-Type": "application/json" },
                                        data: { id: info.row.original.id }
                                    });

                                    // console.log("Deleted successfully:", response.data);
                                    setIstableUpdated((prev) => prev + 1);

                                    toast(`Your id = ${info.row.original.id}  file is Deleted successfully`, {
                                        description: response.data.message,
                                        action: {
                                            label: "Undo",
                                            onClick: () => console.log("Undo"),
                                        },
                                    });

                                } catch (error) {
                                    // console.error("Error deleting:", error);

                                    toast(`Your id = ${info.row.original.id}  file is Delete failed`, {
                                        description: "Failed,",
                                        // action: {
                                        //     label: "Undo",
                                        //     onClick: () => console.log("Undo"),
                                        // },
                                    });
                                }
                            });


                            setIsConfirmAlert(true);

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

            <div className="flex-1 rounded-xl bg-muted/50 p-2">
                <div className="flex gap-4 justify-end">
                    {/* <CustomDrawer /> */}

                    {/* Button to Open Sheet */}
                    <Button variant="outline"
                        onClick={() => {
                            setSheetData({
                                id: 0,
                                name: ""
                            });
                            setIsSheetOpen(true);
                        }}
                    >Add Surface</Button>
                </div>
                <CustomTable tableDesc="A list of your surfaces." url={url} columns={columns} istableUpdated={istableUpdated} />
            </div>

            <CustomSheet
                istableUpdated={istableUpdated}
                setIstableUpdated={setIstableUpdated}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                sheetData={sheetData}
                setSheetData={setSheetData}
                url={url}
            />

            <ConfirmComponent
                isOpen={isConfirmAlert}
                onClose={() => setIsConfirmAlert(false)}
                confirm={alertData}
            />
        </div>
    )
}
