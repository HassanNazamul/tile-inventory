import { NextResponse } from "next/server";
import { inventoryRepo } from '@db/inventoryRepo';
import { db } from "@db/db";
import { inventory } from "@db/schema";
import { products } from "@db/schema";
import { categories } from "@db/schema";
import { dimentions } from "@db/schema";
import { surfaces } from "@db/schema";
import { warehouses } from "@db/schema";
import { like, eq, sql } from "drizzle-orm";


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    // You can also add pagination parameters if needed, e.g., page, pageSize
    // const page = parseInt(searchParams.get("page")) || 1;
    // const pageSize = parseInt(searchParams.get("pageSize")) || 10;
    const limit = 50; // Or use pageSize for dynamic limit

    try {
        let data;

        if (q) {
            const searchQuery = `%${q}%`;
            data = await db
                .select({
                    id: inventory.id,
                    productId: products.id,
                    productName: products.name,
                    categoryName: categories.name,
                    dimensionName: dimentions.name,
                    surfaceName: surfaces.name,
                    boxQuantityPerProduct: products.boxQuantity, // Tiles per box for the product
                    warehouseId: warehouses.id,
                    warehouseName: warehouses.name,
                    warehouseLocation: warehouses.location,
                    totalBoxesIn: inventory.totalBoxesIn,
                    totalBoxesOut: inventory.totalBoxesOut,
                    currentStockBoxes: sql`${inventory.totalBoxesIn} - ${inventory.totalBoxesOut}`.as(
                        "currentStockBoxes"
                    ),
                    createdAt: inventory.createdAt,
                    updatedAt: inventory.updatedAt,
                })
                .from(inventory)
                .innerJoin(products, eq(inventory.productId, products.id))
                .innerJoin(warehouses, eq(inventory.warehouseId, warehouses.id))
                .innerJoin(categories, eq(products.categoryId, categories.id))
                .innerJoin(dimentions, eq(products.dimensionId, dimentions.id))
                .leftJoin(surfaces, eq(products.surfaceId, surfaces.id))
                .where(
                    or(
                        like(products.name, searchQuery),
                        like(categories.name, searchQuery),
                        like(dimentions.name, searchQuery),
                        like(surfaces.name, searchQuery),
                        like(warehouses.name, searchQuery)
                    )
                )
                .limit(limit);
            // .offset((page - 1) * pageSize); // For pagination
        } else {
            // If no search query, fetch all inventory items with details
            data = await db
                .select({
                    id: inventory.id,
                    productId: products.id,
                    productName: products.name,
                    categoryName: categories.name,
                    dimensionName: dimentions.name,
                    surfaceName: surfaces.name,
                    boxQuantityPerProduct: products.boxQuantity,
                    warehouseId: warehouses.id,
                    warehouseName: warehouses.name,
                    warehouseLocation: warehouses.location,
                    totalBoxesIn: inventory.totalBoxesIn,
                    totalBoxesOut: inventory.totalBoxesOut,
                    currentStockBoxes: sql`${inventory.totalBoxesIn} - ${inventory.totalBoxesOut}`.as(
                        "currentStockBoxes"
                    ),
                    createdAt: inventory.createdAt,
                    updatedAt: inventory.updatedAt,
                })
                .from(inventory)
                .innerJoin(products, eq(inventory.productId, products.id))
                .innerJoin(warehouses, eq(inventory.warehouseId, warehouses.id))
                .innerJoin(categories, eq(products.categoryId, categories.id))
                .innerJoin(dimentions, eq(products.dimensionId, dimentions.id))
                .leftJoin(surfaces, eq(products.surfaceId, surfaces.id))
                .limit(limit);
            // .offset((page - 1) * pageSize); // For pagination
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        return NextResponse.json(
            { error: "Failed to fetch inventory data" },
            { status: 500 }
        );
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

    console.log("Received data:", data);
    try {
        await inventoryRepo.create({
            warehouseId: parseInt(data.warehouseId),
            productId: parseInt(data.productId),
            totalBoxesIn: parseInt(data.totalBoxesIn) || 0,
            totalBoxesOut: parseInt(data.totalBoxesOut) || 0,
        });
        return NextResponse.json({ success: true, message: "Inventory added" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const data = await req.json();

    try {
        await inventoryRepo.update(data.id, {
            warehouseId: parseInt(data.warehouseId),
            productId: parseInt(data.productId),
            totalBoxesIn: parseInt(data.totalBoxesIn) || 0,
            totalBoxesOut: parseInt(data.totalBoxesOut) || 0,
        });
        return NextResponse.json({ success: true, message: "Inventory updated" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { id } = await req.json();
    try {
        await inventoryRepo.delete(id);
        return NextResponse.json({ message: "Inventory deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}