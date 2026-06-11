const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function parseResponse(response) {
  const text = await response.text()
  if (!text) return response.ok ? {} : null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getApiErrorMessage(payload, status) {
  if (payload?.message) return payload.message

  const firstError = payload?.errors && Object.values(payload.errors)[0]?.[0]
  if (firstError) return firstError

  return `API error: ${status}`
}

function isInvalidTokenError(payload) {
  return Boolean(
    payload?.errors?.authorization || 
    payload?.message === 'Invalid or expired token.' ||
    payload?.message === 'Unauthenticated.'
  )
}

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  const token = localStorage.getItem('jotdown_token')
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    if (isInvalidTokenError(payload)) {
      window.dispatchEvent(new CustomEvent('jotdown:auth-invalid'))
    }
    throw new Error(getApiErrorMessage(payload, response.status))
  }

  return payload
}
