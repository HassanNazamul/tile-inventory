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

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquareDashed } from "lucide-react";

const surfaceOptions = ["Carving Matt", "Carving Glossy", "Glossy", "Matt"];


interface SheetData {
    id: number;
    name: string;
    categoryId: string;
    dimensionId: string;
    surfaceId: string;
    boxQuantity: string;
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

    // const [selected, setSelected] = useState<string>("");

    // console.log("selected data", selected);

    const [brands, setBrands] = useState<any[]>([]);
    const [sizes, setSizes] = useState<any[]>([]);
    const [displaySurface, setDisplaySurface] = useState<boolean>(false);

    useEffect(() => {
        async function fetchOtherData() {
            let res = await axios.get("/api/inventory/brands?limit=500");
            setBrands(res.data.data);
            res = await axios.get("/api/inventory/sizes?limit=500");
            setSizes(res.data.data);
        }
        fetchOtherData();

        if (sizes[Number(sheetData?.dimensionId)]?.surface == 1) {
            setDisplaySurface(true);
        }
    }, []);


    const handleChange = (e: any) => {
        console.log(e.target.name, e.target.value);
        setSheetData({ ...sheetData, [e.target.name]: e.target.value });
    };

    const handleBrandChange = (value: string) => {
        setSheetData({ ...sheetData, categoryId: value });
    };

    const handleSurfaceChange = (value: string) => {
        setSheetData({ ...sheetData, surfaceId: value });
    };

    const handleSizeChange = (value: string) => {
        setSheetData({ ...sheetData, dimensionId: String(value) });

        if (sizes[Number(value)]?.surface == 1) {
            setDisplaySurface(true);
        } else {
            setDisplaySurface(false);
        }
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
                        name: "",
                        categoryId: "",
                        dimensionId: "",
                        surfaceId: "",
                        boxQuantity: "",
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
                    <SheetTitle>{sheetData?.id === 0 ? "Add Desing" : "Update Desing"}</SheetTitle>
                    <SheetDescription>
                        {sheetData?.id === 0 ? "Fill in the details to add a new Desing." : "Modify the Desing details and click update."}
                    </SheetDescription>
                </SheetHeader>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>{sheetData?.id === 0 ? "Add Desing" : "Update Desing"}</CardTitle>
                        <CardDescription>{sheetData?.id === 0 ? "Fill in the details to add a new Desing." : "Modify the Desing details and click update."}</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Desing Name</Label>
                                <Input type="text" name="name" placeholder="Enter Desing name" value={sheetData?.name} onChange={handleChange} required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="categoryId">Brands</Label>
                                <Select name="categoryId" onValueChange={handleBrandChange} value={String(sheetData?.categoryId)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Sizes</Label>
                                <div className="max-h-[120px] overflow-y-auto custom-scrollbar border border-gray-400 ">
                                    <ToggleGroup
                                        type="single"
                                        value={String(sheetData.dimensionId)}
                                        onValueChange={handleSizeChange}
                                        className="flex flex-wrap gap-1 p-2"
                                    >
                                        {sizes.map((dim) => (
                                            <ToggleGroupItem
                                                key={dim.id}
                                                value={String(dim.id)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-center w-[80px] truncate"
                                            >
                                                {dim.name}
                                                {(dim.surface == 1) ? <SquareDashed size={16} strokeWidth={1} /> : ''}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>
                                <small className="font-thin  text-teal-500">What type of size?</small>
                            </div>

                            {(displaySurface == false) ?
                                <div className="grid gap-2">
                                    <Label htmlFor="surface">Surface {displaySurface}</Label>
                                    <Select name="categoryId" onValueChange={handleSurfaceChange} value={String(sheetData?.surfaceId)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {surfaceOptions.map((surface, index) => (
                                                <SelectItem key={index} value={String(index)}>
                                                    {surface}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <small className="font-thin  text-teal-500">What type of surface?</small>
                                </div>
                            : ""}
                            <div className="grid gap-2">
                                <Label htmlFor="boxQuantity">Quantity per Box</Label>
                                <Input type="number" id="boxQuantity" name="boxQuantity" placeholder="E.g. 2, 3, 5 .." value={sheetData?.boxQuantity} onChange={handleChange} required />
                                <small className="font-thin  text-teal-500">How many tiles are there in one box?</small>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <SheetClose asChild>
                                <Button type="button" variant="secondary">Close</Button>
                            </SheetClose>
                            <Button type="submit" variant={sheetData?.id === 0 ? "secondary" : "outline"}>
                                {sheetData?.id === 0 ? "Add Desing" : "Update Desing"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </SheetContent>
        </Sheet>
    );
}
