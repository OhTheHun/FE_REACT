export const sampleNotes = [
  {
    id: 'note-1',
    title: 'Ý tưởng giao diện chính',
    content: 'Thiết kế landing page với bảng điều khiển ghi chú, sử dụng theme tối và sáng.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Đồng bộ offline',
    content: 'Lưu ghi chú cục bộ và đồng bộ khi người dùng quay lại trạng thái online.',
    updatedAt: new Date().toISOString(),
  },
]

export function createEmptyNote() {
  return {
    id: `note-${Date.now()}`,
    title: 'Ghi chú mới',
    content: '',
    updatedAt: new Date().toISOString(),
  }
}
