"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquareDashed } from "lucide-react";
import { products } from "@/db/schema";


interface SheetData {
    id: number,
    warehouseId: string,
    productId: string,
    totalBoxesIn: string
}

interface CustomSheetProps {
    istableUpdated: number;
    setIstableUpdated: (value: number) => void;
    isOpen: boolean;
    onClose: () => void;
    sheetData: SheetData,
    setSheetData: (data: SheetData) => void,
    url: string
}

export default function CustomSheet({ istableUpdated, setIstableUpdated, isOpen, onClose, sheetData, setSheetData, url }: CustomSheetProps) {
    console.log("CustomSheet -> sheetData", sheetData)


    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [searchData, setSearchData] = useState<any[]>([]);


    useEffect(() => {
        async function fetchOtherData() {
            let res = await axios.get("/api/warehouse?limit=10");
            setWarehouses(res.data.data);
        }
        fetchOtherData();

    }, []);


    const handleChange = (e: any) => {
        setSheetData({ ...sheetData, [e.target.name]: e.target.value });
    };

    const handleWareHouseChange = (value: string) => {
        setSheetData({ ...sheetData, warehouseId: String(value) });
    }

    const handleSearch = async (e: any) => {
        console.log("ee",);
        try {
            const response = await axios.get(`/api/inventory/desings/search?q=${e.target.value}`);
            setSearchData(response.data.data);
            console.log(searchData);
        } catch (err) {
            console.log("cannot search");
        }
    }

    const handleSelectProduct = (product: any) => {
        console.log(product);
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = sheetData?.id ? "put" : "post";

            const response = await axios({
                method,
                url,
                headers: { "Content-Type": "application/json" },
                data: sheetData,
            });

            if (response) {

                toast(response.data.message, {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    position: "bottom-left"
                });

                if (response.data.success = true) {
                    setSheetData({
                        id: 0,
                        warehouseId: "",
                        productId: "",
                        totalBoxesIn: "",
                    });
                    setIstableUpdated(++istableUpdated);
                    onClose();
                }

            }

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (

        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="max-h-full overflow-y-auto custom-scrollbar">
                {/* <SheetContent side="right"> */}

                <SheetHeader>
                    <SheetTitle>{sheetData?.id === 0 ? "Add Inventory" : "Update Inventory"}</SheetTitle>
                    <SheetDescription>
                        {sheetData?.id === 0 ? "Fill in the details to add a new Inventory." : "Modify the Inventory details and click update."}
                    </SheetDescription>
                </SheetHeader>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>{sheetData?.id === 0 ? "Add Inventory" : "Update Inventory"}</CardTitle>
                        <CardDescription>{sheetData?.id === 0 ? "Fill in the details to add a new Inventory." : "Modify the Inventory details and click update."}</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* <div className="grid gap-2">
                                <Label htmlFor="name">Desing Name</Label>
                                <Input type="text" name="name" placeholder="Search desing..." onChange={handleSearch} required />
                                <small className="font-thin  text-teal-500">Search desing or brand?</small>
                            </div>
                            <div className="max-h-[120px] overflow-y-auto custom-scrollbar border border-gray-400 ">
                                {searchData.length > 0 && (
                                    <ul className="list-group mt-2">
                                        {searchData.map((product) => (
                                            <li
                                                key={product.id}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleSelectProduct(product)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {product.categoryName} >   {product.name} - {product.boxQuantity}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div> */}

                            <div className="grid gap-2">
                                <Label htmlFor="name">Design Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Search design..."
                                    onChange={handleSearch}
                                    required
                                    className="border border-gray-300 focus:ring-2 focus:ring-teal-400"
                                />
                                <small className="font-thin text-teal-500">Search design or brand?</small>

                                {searchData.length > 0 && (
                                    <Card className="max-h-[120px] overflow-y-auto custom-scrollbar border border-gray-400  shadow-md mt-2">
                                        <Command>
                                            <CommandList className="p-2">
                                                {searchData.map((design) => (
                                                    <CommandItem
                                                        key={design.id}
                                                        onSelect={() => handleSelectdesign(design)}
                                                        className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all"
                                                    >
                                                        {/* <span className="font-medium">{design.name.toUpperCase()} ({design.dimensionName}) {design.surfaceName} surface of Brand, ({design.categoryName}), having {design.boxQuantity} pcs / box </span> */}
                                                        <div className="w-full flex flex-wrap items-center justify-between gap-1 p-2 border rounded-md bg-background shadow-sm transition-all hover:scale-110 hover:shadow-md">
                                                            <span className="text-sm font-semibold text-primary truncate">
                                                                {design.name.toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground truncate">
                                                                ({design.dimensionName}) {design.surfaceName}  {design.boxQuantity} pcs / box
                                                                Brand: <span className="font-medium text-foreground">{design.categoryName}</span>
                                                            </span>

                                                        </div>


                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                            <CommandEmpty className="text-gray-500 text-sm p-2">No results found.</CommandEmpty>
                                        </Command>
                                    </Card>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>Warehouse</Label>
                                <div className="max-h-[120px] overflow-y-auto custom-scrollbar border border-gray-400  rounded-md cursor-pointer transition-all">
                                    <ToggleGroup
                                        type="single"
                                        value={String(sheetData.warehouseId)}
                                        onValueChange={handleWareHouseChange}
                                        className="flex flex-wrap gap-1 p-2"
                                    >
                                        {warehouses.map((warehouse) => (
                                            <ToggleGroupItem
                                                key={warehouse.id}
                                                value={String(warehouse.id)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-center w-[120px] truncate"
                                            >
                                                {warehouse.name}
                                                {(warehouse.surface == 1) ? <SquareDashed size={16} strokeWidth={1} /> : ''}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>
                                <small className="font-thin  text-teal-500">Selet which warehouse you want to add?</small>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="totalBoxesIn">Quantity</Label>
                                <Input type="number" id="totalBoxesIn" name="totalBoxesIn" placeholder="E.g. 2, 3, 5 .." value={sheetData?.totalBoxesIn} onChange={handleChange} required />
                                <small className="font-thin  text-teal-500">How many box you want to add?</small>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <SheetClose asChild>
                                <Button type="button" variant="secondary">Close</Button>
                            </SheetClose>
                            <Button type="submit" variant={sheetData?.id === 0 ? "secondary" : "outline"}>
                                {sheetData?.id === 0 ? "Add Inventory" : "Update Inventory"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </SheetContent>
        </Sheet>
    );
}
