import { jwtDecode } from "jwt-decode"

// lib/clientAuth.ts
export function getDecodeToken(): string | null {
  if (typeof window === 'undefined') return null
 
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = jwtDecode<{ id: string }>(token)
    return payload.id
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

export function logout(redirect: (path: string) => void, redirectTo = '/login') {
  removeToken()
  redirect(redirectTo)
}
