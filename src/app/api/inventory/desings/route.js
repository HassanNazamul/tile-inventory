import { NextResponse } from "next/server";
import { productsRepo } from '@db/productsRepo';
import { db } from "@db/db";
import { products } from "@db/schema";
import { categories } from "@db/schema";
import { dimentions } from "@db/schema";
import { surfaces } from "@db/schema";
import { and, like, asc, desc, eq } from "drizzle-orm";
import { integer } from "drizzle-orm/gel-core";


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
            .filter(([field]) =>
                ["id", "name", "categoryName", "dimensionName", "boxQuantity", "createdAt"].includes(field)
            )
            .map(([field, value]) => {
                if (field === "categoryName") return like(categories.name, `%${value}%`);
                if (field === "dimensionName") return like(dimentions.name, `%${value}%`);
                return like(products[field], `%${value}%`);
            });

        // Build Sorting (ORDER BY Clause)
        const sortFields = Object.entries(columnOrders)
            .filter(([field]) =>
                ["id", "name", "categoryName", "dimensionName", "boxQuantity", "createdAt"].includes(field)
            )
            .map(([field, order]) => {
                if (field === "categoryName") return order === "desc" ? desc(categories.name) : asc(categories.name);
                if (field === "dimensionName") return order === "desc" ? desc(dimentions.name) : asc(dimentions.name);
                return order === "desc" ? desc(products[field]) : asc(products[field]);
            });

        // Fetch Filtered, Sorted, and Paginated Data with Joins
        const data = await db
            .select({
                id: products.id,
                name: products.name,
                categoryName: categories.name,
                dimensionName: dimentions.name,
                surfaceName: surfaces.name,
                boxQuantity: products.boxQuantity,
                createdAt: products.createdAt,
                categoryId: products.categoryId,
                dimensionId: products.dimensionId,
                surfaceId: products.surfaceId
            })
            .from(products)
            .innerJoin(categories, eq(products.categoryId, categories.id))
            .innerJoin(dimentions, eq(products.dimensionId, dimentions.id))
            .leftJoin(surfaces, eq(products.surfaceId, surfaces.id))
            .where(searchConditions.length ? and(...searchConditions) : undefined)
            .orderBy(...(sortFields.length ? sortFields : [asc(products.id)])) // Default sorting by ID
            .limit(limit)
            .offset(offset);

        // Fetch Total Count
        const totalResult = await db
            .select({ total: db.$count(products) })
            .from(products)
            .innerJoin(categories, eq(products.categoryId, categories.id))
            .innerJoin(dimentions, eq(products.dimensionId, dimentions.id))
            .leftJoin(surfaces, eq(products.surfaceId, surfaces.id))
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

//     // Pagination
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const offset = (page - 1) * limit;

//     // Extract Filters and Sorting from Query Params
//     let columnFilters = {};
//     let columnOrders = {};

//     try {
//         columnFilters = JSON.parse(searchParams.get("columnFilters") || "{}");
//         columnOrders = JSON.parse(searchParams.get("columnOrders") || "{}");
//     } catch (error) {
//         console.error("Invalid JSON in columnFilters or columnOrders:", error);
//         return NextResponse.json({ error: "Invalid filter or sort format" }, { status: 400 });
//     }

//     try {
//         // Build Search Conditions (WHERE Clause)
//         const searchConditions = Object.entries(columnFilters)
//             .filter(([field]) => products.hasOwnProperty(field)) // Ensure field exists
//             .map(([field, value]) => like(products[field], `%${value}%`));

//         // Build Sorting (ORDER BY Clause) & Preserve Order
//         const sortFields = Object.entries(columnOrders)
//             .filter(([field]) => products.hasOwnProperty(field)) // Ensure field exists
//             .map(([field, order]) => (order === "desc" ? desc(products[field]) : asc(products[field])));

//         // Fetch Filtered, Sorted, and Paginated Data
//         const query = db
//             .select()
//             .from(products)
//             .where(searchConditions.length ? and(...searchConditions) : undefined)
//             .orderBy(...(sortFields.length ? sortFields : [asc(products.id)])) // Default sorting by ID
//             .limit(limit)
//             .offset(offset);

//         // console.log(query.toSQL().sql); // Log Raw SQL Query
//         // console.log(query.toSQL().params); // Log Query Parameters

//         const data = await query;

//         // Fetch Total Count
//         const totalResult = await db
//             .select({ total: db.$count(products) })
//             .from(products)
//             .where(searchConditions.length ? and(...searchConditions) : undefined);

//         const total = totalResult.length > 0 ? totalResult[0].total : 0;

//         return NextResponse.json({
//             data,
//             totalPages: Math.ceil(total / limit),
//         });
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//     }
// }



export async function POST(req) {

    const data = await req.json();

    try {

        await productsRepo.create({
            name: data.name,
            categoryId: parseInt(data.categoryId),
            dimensionId: parseInt(data.dimensionId),
            surfaceId: parseInt(data.surfaceId) | 0,
            boxQuantity: data.boxQuantity | 0,
        });
        return NextResponse.json({ success: true, message: "Brand added" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const data = await req.json();

    const [{ surface }] = await db
        .select({ surface: dimentions.surface })
        .from(dimentions)
        .where(eq(parseInt(data.dimensionId), dimentions.id));

    try {
        await productsRepo.update(data.id, {
            name: data.name,
            categoryId: parseInt(data.categoryId),
            dimensionId: parseInt(data.dimensionId),
            surfaceId: (surface == 0) ? 0 : parseInt(data.surfaceId) | 0,
            boxQuantity: parseInt(data.boxQuantity) | 0,
        });
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