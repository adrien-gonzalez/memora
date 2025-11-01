// app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/auth'

type NoteBody = {
  title: string
  description: string
  subcategoryId: string
  snippets?: { code: string; language: string; order: number }[]
}

export async function GET(req: NextRequest) {
  // Récupérer l'utilisateur depuis le token
  const user = getUserIdFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const subcategoryId = searchParams.get('subcategoryId')

  // Récupérer les notes liées à l'utilisateur
  const notes = await prisma.note.findMany({
    where: { userId: user, ...(subcategoryId ? { subcategoryId } : {}) },
    include: { 
      snippets: { orderBy: { order: 'asc' } },
      subcategory: { include: { category: true } }
    },
    orderBy: { order: 'asc' }
  })

  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { title, description, subcategoryId, snippets }: NoteBody = await req.json()

  const newNote = await prisma.note.create({
    data: {
      title,
      description,
      order: 0,
      userId,           // l'ID de l'utilisateur
      subcategoryId,    // ← juste l'ID, pas besoin de .subcategory.connect
      ...(snippets && snippets?.length > 0 && {
        snippets: {
          create: snippets.map(s => ({ code: s.code, language: s.language, order: s.order }))
        }
      }),
    },
    include: {
      snippets: true,
      subcategory: { include: { category: true } },
    },
  })



  return NextResponse.json(newNote, { status: 201 })
}

/**
 * PATCH /api/notes
 * Body attendu:
 * { notes: [{ id: string, order: number }, ...] }
 * ou directement: [{ id: string, order: number }, ...]
 */
export async function PATCH(req: NextRequest) {
  console.log("dddddddd");

  const userId = getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  let body: any
  try {
    body = await req.json()
  } catch (err) {
    return NextResponse.json({ error: 'Corps de requête invalide (JSON attendu)' }, { status: 400 })
  }

  // Accept either { notes: [...] } or [...]
  const rawNotes = Array.isArray(body) ? body : body?.notes
  if (!Array.isArray(rawNotes)) {
    return NextResponse.json({ error: 'notes doit être un tableau' }, { status: 400 })
  }

  // Nettoyage / validation basique
  const toUpdate = rawNotes
    .map((n: any) => ({ id: String(n?.id), order: Number(n?.order) }))
    .filter((n: any) => n.id && Number.isFinite(n.order))

  if (toUpdate.length === 0) {
    return NextResponse.json({ error: 'Aucune note valide à mettre à jour' }, { status: 400 })
  }

  try {
    // On utilise une transaction pour s'assurer que la lecture après écriture voit les changements.
    const updatedNotes = await prisma.$transaction(async (tx) => {
      // updateMany est utilisé pour éviter les erreurs si une note n'appartient pas à l'utilisateur (count=0)
      await Promise.all(
        toUpdate.map((n) =>
          tx.note.updateMany({
            where: { id: n.id, userId }, // garantit que l'utilisateur ne peut pas modifier une note qui n'est pas à lui
            data: { order: n.order },
          })
        )
      )

      const ids = toUpdate.map((n) => n.id)
      // Retourne les notes mises à jour (filtrées sur l'userId pour sécurité)
      return tx.note.findMany({
        where: { id: { in: ids }, userId },
        include: {
          snippets: { orderBy: { order: 'asc' } },
          subcategory: { include: { category: true } },
        },
        orderBy: { order: 'asc' },
      })
    })

    return NextResponse.json(updatedNotes)
  } catch (err) {
    console.error('Erreur lors de la mise à jour des ordres de notes :', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

