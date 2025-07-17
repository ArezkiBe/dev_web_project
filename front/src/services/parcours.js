import { useUserStore } from '../stores/user'

const API_URL = 'http://localhost:3000'

const STATUS_TO_PRISMA = {
  'not-started': 'A_FAIRE',
  'in-progress': 'EN_COURS',
  'completed': 'TERMINE'
}

const STATUS_FROM_PRISMA = {
  'A_FAIRE': 'not-started',
  'EN_COURS': 'in-progress',
  'TERMINE': 'completed'
}

function convertStatusToPrisma(status) {
  return STATUS_TO_PRISMA[status] || status
}

function convertStatusFromPrisma(status) {
  return STATUS_FROM_PRISMA[status] || status
}

function convertModuleFromAPI(module) {
  return {
    ...module,
    statut: convertStatusFromPrisma(module.statut)
  }
}

function convertModuleToAPI(moduleData) {
  return {
    ...moduleData,
    statut: convertStatusToPrisma(moduleData.statut)
  }
}

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
  const parcours = await response.json()
  
  return parcours.map(p => ({
    ...p,
    modules: p.modules ? p.modules.map(convertModuleFromAPI) : []
  }))
}

export async function getParcoursById(id) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/parcours/${id}`, { headers })
  if (!response.ok) {
    throw new Error('Failed to fetch parcours details')
  }
  const parcours = await response.json()
  
  return {
    ...parcours,
    modules: parcours.modules ? parcours.modules.map(convertModuleFromAPI) : []
  }
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

export async function createModule(parcoursId, moduleData) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/parcours/${parcoursId}/modules`, {
    method: 'POST',
    headers,
    body: JSON.stringify(convertModuleToAPI(moduleData))
  })
  if (!response.ok) {
    throw new Error('Failed to create module')
  }
  const module = await response.json()
  return convertModuleFromAPI(module)
}

export async function updateModule(moduleId, moduleData) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/modules/${moduleId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(convertModuleToAPI(moduleData))
  })
  if (!response.ok) {
    throw new Error('Failed to update module')
  }
  const module = await response.json()
  return convertModuleFromAPI(module)
}

export async function deleteModule(moduleId) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_URL}/modules/${moduleId}`, {
    method: 'DELETE',
    headers
  })
  if (!response.ok) {
    throw new Error('Failed to delete module')
  }
}
