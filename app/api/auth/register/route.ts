import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json()

  if (!email || !password || !firstName || !lastName)
    return NextResponse.json({ success: false, error: 'Champs manquants' })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing)
   return NextResponse.json({ success: false, error: "Email déjà utilisé" },)

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { firstName, lastName, email, password: hashed },
  })

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })

}
