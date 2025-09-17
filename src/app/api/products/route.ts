import { NextResponse } from "next/server"
import { prisma } from "@/utils/prisma"

export async function GET() {
  const products = await prisma.product.findMany({
    include:{category: true}
  })
  return NextResponse.json(products)
}
