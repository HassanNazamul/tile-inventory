import { NextResponse } from "next/server";
import { productsRepo } from '@db/productsRepo';
import { db } from "@db/db"; // Assuming you have a database connection
import { products } from "@db/schema"; // Your Drizzle schema
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
            .filter(([field]) => products.hasOwnProperty(field)) // Ensure field exists
            .map(([field, value]) => like(products[field], `%${value}%`));

        // Build Sorting (ORDER BY Clause) & Preserve Order
        const sortFields = Object.entries(columnOrders)
            .filter(([field]) => products.hasOwnProperty(field)) // Ensure field exists
            .map(([field, order]) => (order === "desc" ? desc(products[field]) : asc(products[field])));

        // Fetch Filtered, Sorted, and Paginated Data
        const query = db
            .select()
            .from(products)
            .where(searchConditions.length ? and(...searchConditions) : undefined)
            .orderBy(...(sortFields.length ? sortFields : [asc(products.id)])) // Default sorting by ID
            .limit(limit)
            .offset(offset);

        // console.log(query.toSQL().sql); // Log Raw SQL Query
        // console.log(query.toSQL().params); // Log Query Parameters

        const data = await query;

        // Fetch Total Count
        const totalResult = await db
            .select({ total: db.$count(products) })
            .from(products)
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
//             .from(products)
//             .where(search ? like(products.name, `%${search}%`) : undefined)
//             .orderBy(sortOrder(products[sortField]))
//             .limit(limit)
//             .offset(offset);

//         const [{ total }] = await db
//             .select({ total: db.$count(products) })
//             .from(products)
//             .where(search ? like(products.name, `%${search}%`) : undefined);

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
        await productsRepo.create({ name: data.name });
        return NextResponse.json({ success: true, message: "Brand added" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const data = await req.json();

    try {
        await productsRepo.update(data.id, { name: data.name });
        return NextResponse.json({ success: true, message: "Brand updated" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { id } = await req.json();
    await productsRepo.delete(id);
    return NextResponse.json({ message: "Brand deleted" }, { status: 200 });
}