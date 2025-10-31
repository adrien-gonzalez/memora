import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if(!email || !password){
    return NextResponse.json({  success: false, error: 'Veuillez remplir tous les champs' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) 
    return NextResponse.json({  success: false, error: 'Identifiants invalides. Veuillez vérifier vos informations de connexion.' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return NextResponse.json({  success: false, error: 'Identifiants invalides. Veuillez vérifier vos informations de connexion.' })

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' })

  return NextResponse.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })
}
