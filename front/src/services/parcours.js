import { useUserStore } from '../stores/user'

const API_URL = 'http://localhost:3000'

async function getAuthHeaders() {
  const userStore = useUserStore()
  const user = userStore.user
  if (!user || !user.localAccountId) {
    throw new Error('User not authenticated')
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user.localAccountId}`
  }
}

export async function getParcours() {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/parcours`, { headers })
  if (!response.ok) {
    throw new Error('Failed to fetch parcours')
  }
  return response.json()
}

export async function createParcours(parcoursData) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/parcours`, {
    method: 'POST',
    headers,
    body: JSON.stringify(parcoursData)
  })
  if (!response.ok) {
    throw new Error('Failed to create parcours')
  }
  return response.json()
}
