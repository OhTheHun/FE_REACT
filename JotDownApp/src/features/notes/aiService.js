import { apiFetch } from '../../services/api'

export async function summarizeNoteContent(content) {
  return apiFetch('/api/ai/summarize', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function fixGrammarNoteContent(content) {
  return apiFetch('/api/ai/fix-grammar', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function testModeration(content) {
  return apiFetch('/api/ai/test-moderation', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
