"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface CustomSheetProps {
    istableUpdated,
    setIstableUpdated: (value: number) => void;
}

export default function CustomSheet({ istableUpdated, setIstableUpdated }: CustomSheetProps) {
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = formData.id ? "put" : "post";
            const url = "/api/warehouse";

            const response = await axios({
                method,
                url,
                headers: { "Content-Type": "application/json" },
                data: formData,
            });

            if (response) {

                toast(response.data.message, {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    position: "bottom-left"
                });

                if (response.data.success = true) {
                    setFormData({
                        id: 0,
                        name: "",
                        location: "",
                    });
                    setIstableUpdated(++istableUpdated);
                }

            }

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Sheet>
            {/* Button to Open Sheet */}
            <SheetTrigger asChild>
                <Button variant="outline">{formData.id === 0 ? "Add Warehouse" : "Edit Warehouse"}</Button>
            </SheetTrigger>

            {/* Sheet Content */}
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>{formData.id === 0 ? "Add Warehouse" : "Update Warehouse"}</SheetTitle>
                    <SheetDescription>
                        {formData.id === 0
                            ? "Fill in the details to add a new warehouse."
                            : "Modify the warehouse details and click update."}
                    </SheetDescription>
                </SheetHeader>

                {/* Card Wrapper */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Warehouse Details</CardTitle>
                        <CardDescription>Enter the necessary information below.</CardDescription>
                    </CardHeader>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Warehouse Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Warehouse Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    placeholder="Enter warehouse name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    type="text"
                                    id="location"
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </CardContent>

                        {/* Footer */}
                        <CardFooter className="flex justify-between">
                            <SheetClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </SheetClose>

                            <Button type="submit" variant={formData.id === 0 ? "primary" : "info"}>
                                {formData.id === 0 ? "Add Warehouse" : "Update Warehouse"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </SheetContent>
        </Sheet>
    );
}
