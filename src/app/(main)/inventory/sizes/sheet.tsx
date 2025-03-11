import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    // SheetFooter,
    SheetHeader,
    SheetTitle,
    // SheetTrigger,
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

interface SheetData {
    id: number;
    name: string;
    surface: number;
}
interface CustomSheetProps {
    istableUpdated: number;
    setIstableUpdated: (value: number) => void;
    isOpen: boolean;
    onClose: () => void;
    sheetData: {
        id: number,
        name: string,
        surface: number
    },
    setSheetData: (data: SheetData) => void,
    url: string
}

export default function CustomSheet({ istableUpdated, setIstableUpdated, isOpen, onClose, sheetData, setSheetData, url }: CustomSheetProps) {
    console.log("CustomSheet -> sheetData", sheetData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log([e.target.id], e.target.value)
        setSheetData({ ...sheetData, [e.target.id]: e.target.value });
    };

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
                        surface: 0,
                    });
                    setIstableUpdated(++istableUpdated);
                }

            }

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            {/* Sheet Content */}
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>{sheetData?.id === 0 ? "Add Size" : "Update Size"}</SheetTitle>
                    <SheetDescription>
                        {sheetData?.id === 0
                            ? "Fill in the details to add a new Size."
                            : "Modify the Size details and click update."}
                    </SheetDescription>
                </SheetHeader>

                {/* Card Wrapper */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Size Details</CardTitle>
                        <CardDescription>Enter the necessary information below.</CardDescription>
                    </CardHeader>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Size Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Size Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    placeholder="Enter Size name"
                                    value={sheetData?.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div className="flex gap-4">
                                <Checkbox
                                    id="surface"
                                    checked={sheetData.surface === 1} // Checked if surface is 1
                                    onCheckedChange={(checked) => {
                                        setSheetData((prev) => ({
                                            ...prev,
                                            surface: checked ? 1 : 0, // Toggle between 1 and 0
                                        }));
                                    }}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="surface"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Has Surface?
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        Check if this item has a surface.
                                    </p>
                                </div>
                            </div>
                        </CardContent>

                        {/* Footer */}
                        <CardFooter className="flex justify-between">
                            <SheetClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </SheetClose>

                            <Button type="submit" variant={sheetData?.id === 0 ? "secondary" : "outline"}>
                                {sheetData?.id === 0 ? "Add Size" : "Update Size"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </SheetContent>
        </Sheet>
    );
}
