import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: Request, context: Params) {
  const { id } = await context.params
  const { name, description } = await req.json()

  const updated = await prisma.category.update({
    where: { id },
    data: { name, description },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, context: Params) {
  const { id } = await context.params

  // Supprimer sous-catégories + notes + snippets
  await prisma.snippet.deleteMany({
    where: { note: { subcategory: { categoryId: id } } },
  })
  await prisma.note.deleteMany({
    where: { subcategory: { categoryId: id } },
  })
  await prisma.subcategory.deleteMany({ where: { categoryId: id } })
  await prisma.category.delete({ where: { id } })

  return NextResponse.json({ success: true })
}