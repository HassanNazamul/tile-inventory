import { NextResponse } from "next/server";

import { warehouses } from '@db/schema';
import { eq } from "drizzle-orm";
import { db } from '@db/db';

export async function GET() {

    const result = await db.select().from(warehouses);
    return NextResponse.json(result, { status: 200 });
}

export async function POST(req) {
    const data = await req.json();
    console.log(data);
    await db.insert(warehouses).values({ name: data.name, location: data.location });
    return NextResponse.json({ message: "Warehouse added" });
}

export async function DELETE(req) {
    const { id } = await req.json();
    // await db.delete().from(warehouses).where({ id });
    await db.delete(warehouses).where(eq(warehouses.id, id));
    return NextResponse.json({ message: "Warehouse deleted" }, { status: 200 });
}