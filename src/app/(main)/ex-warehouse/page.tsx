import React, { useState } from "react";
import CustomDrawer from "@/app/(main)/ex-warehouse/drawer"
import CustomSheet from "@/app/(main)/ex-warehouse/sheet"
import CustomTable from "@/app/(main)/ex-warehouse/table"

export default function Page() {

    return (
        <div className="flex flex-col gap-4 p-4 pt-0">

            <div className="grid auto-rows-min gap-4 md:grid-cols-8">
                <div className="rounded-xl bg-muted/50 p-2">
                    <CustomDrawer />
                </div>
                <div className="rounded-xl bg-muted/50 p-2">
                    <CustomSheet />
                </div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
                <div className="rounded-xl bg-muted/50"></div>
            </div>

            <div className="flex-1 rounded-xl bg-muted/50 p-2">
                <CustomTable />
            </div>

            <div className="grid auto-rows-min gap-4 md:grid-cols-4">
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
            </div>
        </div>
    )
}
