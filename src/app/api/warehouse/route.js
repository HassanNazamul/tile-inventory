import { NextResponse } from "next/server";
import { warehouseRepo } from '@db/warehouseRepo';

export async function GET() {
    const result = await warehouseRepo.findAll();
    return NextResponse.json(result, { status: 200 });
}

export async function POST(req) {
    const data = await req.json();
    console.log(data);
    await warehouseRepo.create({ name: data.name, location: data.location });
    return NextResponse.json({ message: "Warehouse added" });
}

export async function DELETE(req) {
    const { id } = await req.json();
    await warehouseRepo.delete(id);
    return NextResponse.json({ message: "Warehouse deleted" }, { status: 200 });
}