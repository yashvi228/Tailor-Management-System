const TOKEN_KEY = "token"
const USER_KEY = "authUser"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getUserStorageKey(baseKey: string) {
  const user = getStoredUser()
  const userKey = user?.id ?? user?.email ?? "guest"
  return `${baseKey}:${userKey}`
}

export function saveSession(token: string, user?: unknown) {
  const previousUser = getStoredUser()
  const previousId = previousUser?.id ?? previousUser?.email
  const nextUser = user as any
  const nextId = nextUser?.id ?? nextUser?.email

  if (previousId && nextId && previousId !== nextId) {
    sessionStorage.setItem("account-switched", "true")
  }

  localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isTokenValid(token = getToken()) {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    if (!payload.exp) return false
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function hasValidSession() {
  const valid = isTokenValid()
  if (!valid) clearSession()
  return valid
}
