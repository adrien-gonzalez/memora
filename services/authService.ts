import { fetchWithAuth } from "@/lib/fetchWithAuth"

export async function registerUser(data: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  return fetchWithAuth('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}


export async function loginUser(email: string, password: string) {
  return fetchWithAuth('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}
