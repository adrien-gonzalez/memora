import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type UpdateNoteBody = {
  title?: string
  description?: string
  subcategoryId?: string
  snippets?: {
    id?: string
    code: string
    language: string
    order: number
  }[]
  order?: number
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body: UpdateNoteBody = await req.json()

  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.subcategoryId !== undefined && {
          subcategory: { connect: { id: body.subcategoryId } } // <-- correction ici
        }),
        ...(body.snippets && {
          // Prisma n’a pas de upsert multiple direct, donc on peut faire delete/create si tu veux
          snippets: {
            deleteMany: {},
            create: body.snippets.map(s => ({
              code: s.code,
              language: s.language,
              order: s.order,
            })),
          },
        }),
      },
      include: {
        snippets: true,
        subcategory: { include: { category: true } },
      },
    })

    return NextResponse.json(updatedNote)
  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour :', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ✅ DELETE : Supprimer une note
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: 'id requis' }, { status: 400 })
  }

  try {
    // Prisma supprime automatiquement les snippets grâce à onDelete: Cascade
    // Mais on peut le faire explicitement pour plus de clarté
    await prisma.snippet.deleteMany({
      where: { noteId: id },
    })

    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Erreur lors de la suppression :', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}