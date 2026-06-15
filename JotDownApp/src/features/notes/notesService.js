import { apiFetch } from '../../services/api'

export const sampleNotes = [
  {
    id: 'note-1',
    title: 'Ý tưởng giao diện chính',
    content: 'Thiết kế landing page với bảng điều khiển ghi chú, sử dụng theme tối và sáng.',
    color: '#ffffff',
    workspace_id: 'ws-personal',
    folder_id: 'fold-2',
    labels: ['lbl-3'],
    visibility: 'private',
    is_pinned: true,
    is_favorite: true,
    is_protected: false,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Đồng bộ offline',
    content: 'Lưu ghi chú cục bộ và đồng bộ khi người dùng quay lại trạng thái online.',
    color: '#FEF3C7',
    workspace_id: 'ws-personal',
    folder_id: 'fold-1',
    labels: ['lbl-2'],
    visibility: 'public',
    is_pinned: false,
    is_favorite: false,
    is_protected: false,
    updatedAt: new Date().toISOString(),
  },
]

export function createEmptyNote(extras = {}) {
  return {
    id: `note-${Date.now()}`,
    title: 'Ghi chú mới',
    content: '',
    color: '#ffffff',
    workspace_id: 'ws-personal',
    folder_id: null,
    labels: [],
    visibility: 'private',
    is_pinned: false,
    is_favorite: false,
    is_protected: false,
    updatedAt: new Date().toISOString(),
    ...extras,
  }
}

function normalizeNote(note) {
  note = note || {}
  const id = note.id || note.Id
  const labels = Array.isArray(note.labels)
    ? note.labels.map((label) => (typeof label === 'string' ? label : label.id || label.Id)).filter(Boolean)
    : []

  return {
    ...note,
    id,
    labels,
    deleteFlag: Boolean(note.deleteFlag || note.DeleteFlag),
    is_pinned: Boolean(note.is_pinned ?? note.IsPinned),
    is_favorite: Boolean(note.is_favorite ?? note.IsFavorite),
    is_protected: Boolean(note.is_protected ?? note.IsProtected),
    updatedAt: note.updated_at || note.UpdatedTime || note.updatedAt,
    createdAt: note.created_at || note.CreatedTime || note.createdAt,
  }
}

function normalizeNotesResponse(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.notes || []

  return list.map(normalizeNote)
}

function normalizeLabel(label = {}) {
  return {
    ...label,
    id: label.id || label.Id,
    user_id: label.user_id || label.UserId,
    name: label.name || '',
    color: label.color || '#cccccc',
    notes_count: label.notes_count ?? label.notesCount ?? 0,
    created_at: label.created_at || label.CreatedTime,
    updated_at: label.updated_at || label.UpdatedTime,
  }
}

function toNotePayload(note = {}) {
  return {
    workspace_id: note.workspace_id?.startsWith?.('ws-') ? null : note.workspace_id || null,
    folder_id: note.folder_id?.startsWith?.('fold-') ? null : note.folder_id || null,
    title: note.title || 'Ghi chú mới',
    content: note.content || '',
    color: note.color || '#ffffff',
    visibility: note.visibility || 'private',
    is_pinned: Boolean(note.is_pinned),
    is_favorite: Boolean(note.is_favorite),
    is_protected: Boolean(note.is_protected),
    password: note.password || undefined,
    label_ids: note.labels || note.label_ids || [],
  }
}

export async function fetchNotes(params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : value)
    }
  })

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const payload = await apiFetch(`/api/notes${suffix}`)
  return normalizeNotesResponse(payload)
}

export async function createNote(extras = {}) {
  const payload = await apiFetch('/api/notes', {
    method: 'POST',
    body: JSON.stringify(toNotePayload(createEmptyNote(extras))),
  })

  const responseData = payload?.note || payload?.data || payload
  const hasValidData = responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0

  return normalizeNote(hasValidData ? responseData : createEmptyNote(extras))
}

export async function updateNote(note) {
  const payload = await apiFetch(`/api/notes/${note.id}`, {
    method: 'PATCH',
    body: JSON.stringify(toNotePayload(note)),
  })

  return normalizeNote(payload.note || payload.data || payload)
}

export async function deleteNote(id) {
  await apiFetch(`/api/notes/${id}`, {
    method: 'DELETE',
  })

  return id
}

export async function pinNote(id, isPinned) {
  const payload = await apiFetch(`/api/notes/${id}/pin`, {
    method: 'PATCH',
    body: JSON.stringify({ is_pinned: isPinned }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function favoriteNote(id, isFavorite) {
  const payload = await apiFetch(`/api/notes/${id}/favorite`, {
    method: 'PATCH',
    body: JSON.stringify({ is_favorite: isFavorite }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function protectNote(id, isProtected, password) {
  const payload = await apiFetch(`/api/notes/${id}/protection`, {
    method: 'PATCH',
    body: JSON.stringify({ is_protected: isProtected, password }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function shareNote(id, visibility) {
  const payload = await apiFetch(`/api/notes/${id}/share`, {
    method: 'PATCH',
    body: JSON.stringify({ visibility }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function addCollaborator(id, email, permission = 'view') {
  const payload = await apiFetch(`/api/notes/${id}/shares`, {
    method: 'POST',
    body: JSON.stringify({ email, permission }),
  })
  return payload.share || payload.data || payload
}

export async function fetchFolders(workspaceId = null) {
  const backendWorkspaceId = workspaceId?.startsWith?.('ws-') ? null : workspaceId
  const suffix = backendWorkspaceId ? `?workspace_id=${backendWorkspaceId}` : ''
  const payload = await apiFetch(`/api/folders${suffix}`)
  return payload.folders || payload.data || payload || []
}

export async function createFolder(name, workspaceId) {
  const backendWorkspaceId = workspaceId?.startsWith?.('ws-') ? null : workspaceId
  const payload = await apiFetch('/api/folders', {
    method: 'POST',
    body: JSON.stringify({ name, workspace_id: backendWorkspaceId }),
  })
  return payload.folder || payload.data || payload
}

export async function deleteFolder(id) {
  await apiFetch(`/api/folders/${id}`, {
    method: 'DELETE',
  })
  return id
}

export async function fetchLabels() {
  const payload = await apiFetch(`/api/labels`)
  const labels = payload.labels || payload.data || payload || []
  return Array.isArray(labels) ? labels.map(normalizeLabel) : []
}

export async function createLabel(name, color) {
  const payload = await apiFetch('/api/labels', {
    method: 'POST',
    body: JSON.stringify({ name, color }),
  })
  return normalizeLabel(payload.label || payload.data || payload)
}

export async function updateLabel(id, { name, color }) {
  const payload = await apiFetch(`/api/labels/${id}`, {
    method: 'PATCH',

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const payload = await apiFetch(`/api/notes${suffix}`)
  return normalizeNotesResponse(payload)
}

export async function createNote(extras = {}) {
  const payload = await apiFetch('/api/notes', {
    method: 'POST',
    body: JSON.stringify(toNotePayload(createEmptyNote(extras))),
  })

  const responseData = payload?.note || payload?.data || payload
  const hasValidData = responseData && typeof responseData === 'object' && Object.keys(responseData).length > 0

  return normalizeNote(hasValidData ? responseData : createEmptyNote(extras))
}

export async function updateNote(note) {
  const payload = await apiFetch(`/api/notes/${note.id}`, {
    method: 'PATCH',
    body: JSON.stringify(toNotePayload(note)),
  })

  return normalizeNote(payload.note || payload.data || payload)
}

export async function deleteNote(id) {
  await apiFetch(`/api/notes/${id}`, {
    method: 'DELETE',
  })

  return id
}

export async function pinNote(id, isPinned) {
  const payload = await apiFetch(`/api/notes/${id}/pin`, {
    method: 'PATCH',
    body: JSON.stringify({ is_pinned: isPinned }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function favoriteNote(id, isFavorite) {
  const payload = await apiFetch(`/api/notes/${id}/favorite`, {
    method: 'PATCH',
    body: JSON.stringify({ is_favorite: isFavorite }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function protectNote(id, isProtected, password) {
  const payload = await apiFetch(`/api/notes/${id}/protection`, {
    method: 'PATCH',
    body: JSON.stringify({ is_protected: isProtected, password }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function shareNote(id, visibility) {
  const payload = await apiFetch(`/api/notes/${id}/share`, {
    method: 'PATCH',
    body: JSON.stringify({ visibility }),
  })
  return normalizeNote(payload.note || payload.data || payload)
}

export async function addCollaborator(id, email, permission = 'view') {
  const payload = await apiFetch(`/api/notes/${id}/shares`, {
    method: 'POST',
    body: JSON.stringify({ email, permission }),
  })
  return payload.share || payload.data || payload
}

export async function fetchFolders(workspaceId = null) {
  const backendWorkspaceId = workspaceId?.startsWith?.('ws-') ? null : workspaceId
  const suffix = backendWorkspaceId ? `?workspace_id=${backendWorkspaceId}` : ''
  const payload = await apiFetch(`/api/folders${suffix}`)
  return payload.folders || payload.data || payload || []
}

export async function createFolder(name, workspaceId) {
  const backendWorkspaceId = workspaceId?.startsWith?.('ws-') ? null : workspaceId
  const payload = await apiFetch('/api/folders', {
    method: 'POST',
    body: JSON.stringify({ name, workspace_id: backendWorkspaceId }),
  })
  return payload.folder || payload.data || payload
}

export async function deleteFolder(id) {
  await apiFetch(`/api/folders/${id}`, {
    method: 'DELETE',
  })
  return id
}

export async function fetchLabels() {
  const payload = await apiFetch(`/api/labels`)
  const labels = payload.labels || payload.data || payload || []
  return Array.isArray(labels) ? labels.map(normalizeLabel) : []
}

export async function createLabel(name, color) {
  const payload = await apiFetch('/api/labels', {
    method: 'POST',
    body: JSON.stringify({ name, color }),
  })
  return normalizeLabel(payload.label || payload.data || payload)
}

export async function updateLabel(id, { name, color }) {
  const payload = await apiFetch(`/api/labels/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name, color }),
  })
  return normalizeLabel(payload.label || payload.data || payload)
}

export async function deleteLabel(id) {
  await apiFetch(`/api/labels/${id}`, {
    method: 'DELETE',
  })
  return id
}

// ─── Community / Public Notes ───────────────────────────────────────────────

export async function fetchPublicNotes(params = {}) {
  const query = new URLSearchParams({ visibility: 'public' })
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })
  const payload = await apiFetch(`/api/notes/public?${query.toString()}`)
  const list = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.notes || []
  return list.map(normalizeNote)
}

export async function likeNote(id) {
  const payload = await apiFetch(`/api/notes/${id}/like`, {
    method: 'POST',
  })
  return payload
}
