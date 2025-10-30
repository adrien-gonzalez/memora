// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  
  const categories = await prisma.category.findMany({
    where: { userId: { equals: userId } }, 
    include: {
      subcategories: {
        include: {
          _count: { select: { notes: true } }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const data = await req.json()

  const newCategory = await prisma.category.create({
    data: { ...data, userId }  // ← maintenant userId est bien un string
  })

  return NextResponse.json(newCategory)
}

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id, name, description } = await req.json()
  const updated = await prisma.category.updateMany({
    where: { id, userId }, // Update only for this user
    data: { name, description }
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await req.json()
  await prisma.category.deleteMany({ where: { id, userId } })
  return NextResponse.json({ success: true })
}
