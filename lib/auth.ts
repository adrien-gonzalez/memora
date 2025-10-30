import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'changeme'

export function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, SECRET) as { id: string; email: string }
    return payload.id   // ← Retourne juste l'ID
  } catch {
    return null
  }
}


