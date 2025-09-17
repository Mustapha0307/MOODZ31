import { NextResponse } from "next/server"
import { prisma } from "@/utils/prisma"

export async function GET() {
  const tables = await prisma.table.findMany({
    include: {orders: true},
    orderBy: {
      number: "asc"
    }
  })
  return NextResponse.json(tables)
}
