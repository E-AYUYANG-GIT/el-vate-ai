const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Thrown for known, server-reported errors (validation, rate limit, etc).
// Carries the error code so the UI can react differently if it wants to.
export class ApiError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

export async function generateDescription({ message, length, tone, emojiLevel, file }) {
  const formData = new FormData()
  formData.append('message', message)
  if (length) formData.append('length', length)
  if (tone) formData.append('tone', tone)
  if (emojiLevel) formData.append('emojiLevel', emojiLevel)
  if (file) formData.append('file', file)

  let response
  try {
    response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST',
      // No Content-Type header here on purpose — the browser sets the
      // multipart boundary itself when the body is a FormData object.
      body: formData,
    })
  } catch {
    throw new ApiError(
      'NETWORK_ERROR',
      "Can't reach the server right now. Please check your connection and try again."
    )
  }

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.success) {
    throw new ApiError(
      data?.error || 'UNKNOWN_ERROR',
      data?.message || 'Something went wrong. Please try again.'
    )
  }

  return data.description
}
