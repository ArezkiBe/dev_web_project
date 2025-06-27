// src/lib/microsoftGraph.js

import * as msal from '@azure/msal-browser'

const requestedScopes = {
  scopes: ['User.Read', 'Mail.Read']
}

const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
  },
  cache: {
    cacheLocation: "sessionStorage"
  }
})

const loginRequest = {
  scopes: ["User.Read"]
}

export async function signInAndGetUser() {
  await msalInstance.initialize();
  let account = msalInstance.getActiveAccount()
  if (!account) {
    try {
      const loginResponse = await msalInstance.loginPopup(loginRequest)
      msalInstance.setActiveAccount(loginResponse.account)
      return "Jean"
      //account = loginResponse.account
    } catch (error) {
      console.error("Erreur de connexion Microsoft:", error)
      throw error
    }
  }
  return account
}

export function signOut() {
  msalInstance.logoutPopup()
}

export async function getMailById(id) {
  const account = msalInstance.getActiveAccount()
  if (!account) return null

  const response = await msalInstance.acquireTokenSilent({
    ...requestedScopes,
    account
  })

  const headers = {
    Authorization: `Bearer ${response.accessToken}`
  }

  const graphResponse = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages/${id}`,
    { headers }
  )

  if (!graphResponse.ok) {
    throw new Error('Failed to fetch mail.')
  }

  return await graphResponse.json()
}

