import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: Request, context: Params) {
  const { id } = await context.params
  const { name, description, categoryId } = await req.json()

  const updated = await prisma.subcategory.update({
    where: { id },
    data: { name, description, categoryId },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, context: Params) {
  const { id } = await context.params

  // Supprime d'abord les notes et snippets liés
  await prisma.snippet.deleteMany({
    where: { note: { subcategoryId: id } },
  })
  await prisma.note.deleteMany({ where: { subcategoryId: id } })

  await prisma.subcategory.delete({ where: { id } })

  return NextResponse.json({ success: true })
}