import { NextResponse } from "next/server";
import { db } from "@db/db";
import { products } from "@db/schema";
import { categories } from "@db/schema";
import { dimentions } from "@db/schema";
import { surfaces } from "@db/schema";
import { or, like,  eq } from "drizzle-orm";


export async function GET(req) {
    const { searchParams } = new URL(req.url); 
    const q = searchParams.get("q");

    if (!q) {
        return NextResponse.json({ message: "Query is required" }, { status: 400 });
    }

    const searchQuery = `%${q}%`; 
    const limit = 50;
    try {

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
            .where(
                or(
                    like(products.name, searchQuery),
                    like(categories.name, searchQuery),
                    like(dimentions.name, searchQuery),
                    like(surfaces.name, searchQuery)
                )
            )
            .limit(limit);


        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
