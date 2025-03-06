import { NextResponse } from "next/server";
import { warehouseRepo } from '@db/warehouseRepo';
import { db } from "@db/db"; // Assuming you have a database connection
import { warehouses } from "@db/schema"; // Your Drizzle schema
import { like, asc, desc } from "drizzle-orm";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const sortField = searchParams.get("sortField") || "id";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? desc : asc;

    const offset = (page - 1) * limit;

    try {
        const data = await db
            .select()
            .from(warehouses)
            .where(search ? like(warehouses.name, `%${search}%`) : undefined)
            .orderBy(sortOrder(warehouses[sortField]))
            .limit(limit)
            .offset(offset);

        const [{ total }] = await db
            .select({ total: db.$count(warehouses) })
            .from(warehouses)
            .where(search ? like(warehouses.name, `%${search}%`) : undefined);

        console.log(total);
        return NextResponse.json({
            data,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(req) {

    const data = await req.json();

    try {
        await warehouseRepo.create({ name: data.name, location: data.location });
        return NextResponse.json({ success: true, message: "Warehouse added" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { id } = await req.json();
    await warehouseRepo.delete(id);
    return NextResponse.json({ message: "Warehouse deleted" }, { status: 200 });
}