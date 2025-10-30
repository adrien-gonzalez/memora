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
      ...(snippets?.length > 0 && {
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

