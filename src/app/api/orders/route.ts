import { NextResponse } from "next/server"
import { prisma } from "@/utils/prisma"

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {waiter: true, table: true, items:{
        include: {product: true}
    },},
    orderBy: {
      createdAt: "asc"
    }
  })
  return NextResponse.json(orders)
}