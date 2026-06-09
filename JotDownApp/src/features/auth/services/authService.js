import { apiFetch } from '../../../services/api'

function getNestedValue(source, keys) {
  for (const key of keys) {
    const value = key.split('.').reduce((current, part) => current?.[part], source)
    if (value != null) return value
  }
  return null
}

function normalizeRole(user = {}) {
  const role =
    user.role ||
    user.role_name ||
    user.type ||
    user.account_type ||
    user.roles?.[0]?.name ||
    user.roles?.[0]

  if (typeof role === 'string') return role.toLowerCase()
  if (user.is_admin || user.isAdmin) return 'admin'
  return 'user'
}

function normalizeAuthResponse(response, fallback = {}) {
  const token = getNestedValue(response, [
    'token',
    'access_token',
    'data.token',
    'data.access_token',
    'authorization.token',
    'data.authorization.token',
  ])

  const user = getNestedValue(response, ['user', 'data.user', 'data']) || fallback

  return {
    token,
    user: {
      ...fallback,
      ...user,
      role: normalizeRole(user),
    },
    raw: response,
  }
}

export function getRoleHomePath(user) {
  return normalizeRole(user) === 'admin' ? '/admin' : '/notes'
}

export async function loginWithCredentials({ email, password }) {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  return normalizeAuthResponse(response, { email })
}

export async function registerWithCredentials({ display_name, email, password }) {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ display_name, email, password }),
  })

  return normalizeAuthResponse(response, { display_name, name: display_name, email })
}

export async function requestPasswordResetOtp({ email }) {
  return apiFetch('/api/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function verifyPasswordResetOtp({ email, otp, password }) {
  return apiFetch('/api/auth/password/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp, password }),
  })
}

export async function logoutUser() {
  return Promise.resolve()
}
