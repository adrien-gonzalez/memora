// app/api/subcategories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = getUserIdFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const subcategories = await prisma.subcategory.findMany({
    where: { userId: { equals: user.id } }, // ✅ Correction Prisma 6
    include: {
      category: true,
      _count: { select: { notes: true } }
    },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json(subcategories)
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const data = await req.json()
  const newSubcategory = await prisma.subcategory.create({ data: { ...data, userId } })
  return NextResponse.json(newSubcategory)
}

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id, name, description, categoryId } = await req.json()
  const updated = await prisma.subcategory.updateMany({
    where: { id, userId },
    data: { name, description, categoryId }
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await req.json()
  await prisma.subcategory.deleteMany({ where: { id, userId } })
  return NextResponse.json({ success: true })
}
