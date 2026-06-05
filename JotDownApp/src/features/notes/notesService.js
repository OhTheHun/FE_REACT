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
