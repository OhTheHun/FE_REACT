import { apiFetch } from '../../services/api'

function normalizeWorkspace(workspace = {}) {
  return {
    ...workspace,
    id: workspace.id || workspace.Id,
    user_id: workspace.user_id || workspace.UserId,
    name: workspace.name || '',
    description: workspace.description || null,
    folders_count: workspace.folders_count ?? workspace.foldersCount ?? 0,
    notes_count: workspace.notes_count ?? workspace.notesCount ?? 0,
    created_at: workspace.created_at || workspace.CreatedTime,
    updated_at: workspace.updated_at || workspace.UpdatedTime,
  }
}

function normalizeFolder(folder = {}) {
  return {
    ...folder,
    id: folder.id || folder.Id,
    user_id: folder.user_id || folder.UserId,
    workspace_id: folder.workspace_id || folder.WorkspaceId,
    name: folder.name || '',
    notes_count: folder.notes_count ?? folder.notesCount ?? 0,
    created_at: folder.created_at || folder.CreatedTime,
    updated_at: folder.updated_at || folder.UpdatedTime,
  }
}

function pickList(payload, key) {
  const data = payload?.data || payload
  return Array.isArray(data) ? data : data?.[key] || []
}

export async function fetchWorkspaces() {
  const payload = await apiFetch('/api/workspaces')
  return pickList(payload, 'workspaces').map(normalizeWorkspace)
}

export async function createWorkspace({ name, description = null }) {
  const payload = await apiFetch('/api/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })
  return normalizeWorkspace(payload.workspace || payload.data || payload)
}

export async function updateWorkspace(id, { name, description }) {
  const body = { name }
  if (description !== undefined) body.description = description

  const payload = await apiFetch(`/api/workspaces/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  return normalizeWorkspace(payload.workspace || payload.data || payload)
}

export async function deleteWorkspace(id) {
  await apiFetch(`/api/workspaces/${id}`, {
    method: 'DELETE',
  })
  return id
}

export async function fetchWorkspaceFolders(workspaceId) {
  if (!workspaceId) return []

  const payload = await apiFetch(`/api/workspaces/${workspaceId}/folders`)
  return pickList(payload, 'folders').map(normalizeFolder)
}

export async function createWorkspaceFolder(workspaceId, { name }) {
  const payload = await apiFetch(`/api/workspaces/${workspaceId}/folders`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return normalizeFolder(payload.folder || payload.data || payload)
}

export async function updateFolder(id, { name }) {
  const payload = await apiFetch(`/api/folders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
  return normalizeFolder(payload.folder || payload.data || payload)
}

export async function deleteFolder(id) {
  await apiFetch(`/api/folders/${id}`, {
    method: 'DELETE',
  })
  return id
}
