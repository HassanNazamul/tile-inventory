import React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function LimitSelect({ limit, setLimit }: any) {
    return (
        <>
            <span className="text-sm">Per&nbsp;&nbsp;Page</span>
            <Select value={String(limit)} onValueChange={(value) => setLimit(value)}>
                <SelectTrigger className="w-[80px] h-[35px]">
                    <SelectValue defaultValue={limit} placeholder={`${limit} per page`} />
                </SelectTrigger>
                <SelectContent className='w-[100px]'>
                    <SelectGroup>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    );

}