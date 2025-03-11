import { NextResponse } from "next/server";
import { sizesRepo } from '@db/sizesRepo';
import { db } from "@db/db"; // Assuming you have a database connection
import { dimentions } from "@db/schema"; // Your Drizzle schema
import { and, like, asc, desc } from "drizzle-orm";



export async function GET(req) {
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Extract Filters and Sorting from Query Params
    let columnFilters = {};
    let columnOrders = {};

    try {
        columnFilters = JSON.parse(searchParams.get("columnFilters") || "{}");
        columnOrders = JSON.parse(searchParams.get("columnOrders") || "{}");
    } catch (error) {
        console.error("Invalid JSON in columnFilters or columnOrders:", error);
        return NextResponse.json({ error: "Invalid filter or sort format" }, { status: 400 });
    }

    try {
        // Build Search Conditions (WHERE Clause)
        const searchConditions = Object.entries(columnFilters)
            .filter(([field]) => dimentions.hasOwnProperty(field)) // Ensure field exists
            .map(([field, value]) => like(dimentions[field], `%${value}%`));

        // Build Sorting (ORDER BY Clause) & Preserve Order
        const sortFields = Object.entries(columnOrders)
            .filter(([field]) => dimentions.hasOwnProperty(field)) // Ensure field exists
            .map(([field, order]) => (order === "desc" ? desc(dimentions[field]) : asc(dimentions[field])));

        // Fetch Filtered, Sorted, and Paginated Data
        const query = db
            .select()
            .from(dimentions)
            .where(searchConditions.length ? and(...searchConditions) : undefined)
            .orderBy(...(sortFields.length ? sortFields : [asc(dimentions.id)])) // Default sorting by ID
            .limit(limit)
            .offset(offset);

        // console.log(query.toSQL().sql); // Log Raw SQL Query
        // console.log(query.toSQL().params); // Log Query Parameters

        const data = await query;

        // Fetch Total Count
        const totalResult = await db
            .select({ total: db.$count(dimentions) })
            .from(dimentions)
            .where(searchConditions.length ? and(...searchConditions) : undefined);

        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        return NextResponse.json({
            data,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}




// export async function GET(req) {
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const search = searchParams.get("search") || "";
//     const sortField = searchParams.get("sortField") || "id";
//     const sortOrder = searchParams.get("sortOrder") === "desc" ? desc : asc;

//     const offset = (page - 1) * limit;

//     try {
//         const data = await db
//             .select()
//             .from(dimentions)
//             .where(search ? like(dimentions.name, `%${search}%`) : undefined)
//             .orderBy(sortOrder(dimentions[sortField]))
//             .limit(limit)
//             .offset(offset);

//         const [{ total }] = await db
//             .select({ total: db.$count(dimentions) })
//             .from(dimentions)
//             .where(search ? like(dimentions.name, `%${search}%`) : undefined);

//         console.log(total);
//         return NextResponse.json({
//             data,
//             totalPages: Math.ceil(total / limit),
//         });
//     } catch (error) {
//         return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//     }
// }

export async function POST(req) {

    const data = await req.json();

    try {
        await sizesRepo.create({ name: data.name, surface: data.surface });
        return NextResponse.json({ success: true, message: "Size added" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const data = await req.json();

    try {
        await sizesRepo.update(data.id, { name: data.name, surface: data.surface });
        return NextResponse.json({ success: true, message: "Size updated" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { id } = await req.json();
    await sizesRepo.delete(id);
    return NextResponse.json({ message: "Size deleted" }, { status: 200 });
}