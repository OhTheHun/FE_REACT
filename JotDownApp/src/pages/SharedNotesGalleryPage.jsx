import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/common/Toast'
import { fetchPublicNotes, likeNote } from '../features/notes/notesService'

function getReadTime(content = '') {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} phút đọc`
}

function getAuthorInitial(name = '') {
  return name?.charAt(0)?.toUpperCase() || 'U'
}

export default function SharedNotesGalleryPage() {
  const navigate = useNavigate()
  const { show } = useToast()

  const [notes, setNotes] = useState([])
  const [likedIds, setLikedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jotdown_liked_notes') || '[]')
    } catch {
      return []
    }
  })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadNotes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchPublicNotes()
      setNotes(data)
    } catch (err) {
      console.error('Không thể tải ghi chú cộng đồng:', err)
      // Silently fallback to empty - no toast spam
      setNotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const handleLike = async (id, e) => {
    e.stopPropagation()
    const alreadyLiked = likedIds.includes(id)
    // Optimistic update
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, likes_count: (n.likes_count || 0) + (alreadyLiked ? -1 : 1) }
          : n
      )
    )
    const newLikedIds = alreadyLiked
      ? likedIds.filter((lid) => lid !== id)
      : [...likedIds, id]
    setLikedIds(newLikedIds)
    localStorage.setItem('jotdown_liked_notes', JSON.stringify(newLikedIds))

    try {
      await likeNote(id)
    } catch {
      // Revert on error
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, likes_count: (n.likes_count || 0) + (alreadyLiked ? 1 : -1) }
            : n
        )
      )
      setLikedIds(likedIds)
      localStorage.setItem('jotdown_liked_notes', JSON.stringify(likedIds))
    }
  }

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const featuredNote = filteredNotes[0] || null

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      {/* Hero Welcome banner section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-primary-600 text-white p-8 sm:p-12 shadow-xl border border-primary-500/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
            <path d="M0 0 L100 100 L100 0 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            🌐 Thư viện chia sẻ kiến thức
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            JotDown Hub Cộng Đồng
          </h1>
          <p className="text-sm sm:text-base text-violet-100 font-medium leading-relaxed">
            Khám phá ghi chú, lộ trình học tập và ý tưởng sáng tạo được chia sẻ bởi cộng đồng JotDown. Chia sẻ kiến thức của bạn để cùng phát triển.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/notes')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-violet-50 text-primary-600 text-xs font-bold shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              ✍️ Chia sẻ ghi chú của bạn
            </button>
            <a
              href="#explore"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
            >
              🔍 Khám phá ngay
            </a>
          </div>
        </div>
      </div>

      {/* Featured Post Card */}
      {!loading && featuredNote && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ⭐ Ghi chú tiêu điểm hôm nay
          </h2>
          <div
            onClick={() => navigate(`/shared/note/${featuredNote.id}`)}
            className="group grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="md:col-span-4 bg-gradient-to-tr from-pink-500/20 to-primary-500/20 p-8 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-150 dark:border-slate-800">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
                  🎯 NỔI BẬT
                </span>
                <h3 className="text-xl font-black text-slate-850 dark:text-white group-hover:text-primary-500 transition-colors">
                  {featuredNote.title}
                </h3>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {getAuthorInitial(
                    (featuredNote.user?.name || featuredNote.author) !== 'Ẩn danh'
                      ? (featuredNote.user?.name || featuredNote.author)
                      : 'Thành viên JotDown'
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {(featuredNote.user?.name || featuredNote.author) && (featuredNote.user?.name || featuredNote.author) !== 'Ẩn danh'
                      ? (featuredNote.user?.name || featuredNote.author)
                      : 'Thành viên JotDown'}
                  </h4>
                  <p className="text-[10px] text-slate-400">Thành viên JotDown</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-350 line-clamp-5 leading-relaxed whitespace-pre-wrap">
                {featuredNote.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">👁️ {featuredNote.views_count || 0} lượt xem</span>
                  <span>⏱️ {getReadTime(featuredNote.content)}</span>
                </div>
                <button
                  onClick={(e) => handleLike(featuredNote.id, e)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    likedIds.includes(featuredNote.id)
                      ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                      : 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400'
                  }`}
                >
                  <span>{likedIds.includes(featuredNote.id) ? '❤️' : '🤍'} {featuredNote.likes_count || 0}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explorer / Listing Section */}
      <div id="explore" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-850 pb-5">
          <div className="relative w-full md:w-72">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm nội dung ghi chép..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Gallery Cards layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/6" />
                </div>
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 text-slate-350 dark:text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">
              {search ? 'Không tìm thấy ghi chú phù hợp' : 'Chưa có ghi chú công khai nào'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {search ? 'Vui lòng kiểm tra lại từ khóa.' : 'Hãy là người đầu tiên chia sẻ ghi chú!'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/notes')}
                className="mt-4 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-all cursor-pointer"
              >
                ✍️ Chia sẻ ngay
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((n) => {
              const rawAuthor = n.user?.name || n.author || ''
              const authorName = (rawAuthor && rawAuthor !== 'Ẩn danh') ? rawAuthor : 'Thành viên JotDown'
              const isLiked = likedIds.includes(n.id)

              return (
                <div
                  key={n.id}
                  onClick={() => navigate(`/shared/note/${n.id}`)}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Author header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-black text-xs flex items-center justify-center border border-primary-200/30">
                          {getAuthorInitial(authorName)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-850 dark:text-white line-clamp-1">{authorName}</h4>
                          <span className="text-[10px] text-slate-400 block">Thành viên JotDown</span>
                        </div>
                      </div>
                    </div>

                    {/* Note details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                          🗒️ Ghi chú công khai
                        </span>
                        <span className="text-[9px] text-slate-450">{getReadTime(n.content)}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors">
                        {n.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  </div>

                  {/* Stats footer */}
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-850">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleLike(n.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all hover:scale-105 ${
                          isLiked
                            ? 'bg-red-100 dark:bg-red-950/30 text-red-500'
                            : 'bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-400'
                        }`}
                      >
                        <span>{isLiked ? '❤️' : '🤍'} {n.likes_count || 0}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">👁️ {n.views_count || 0}</span>
                    </div>

                    <span className="text-[10px] font-bold text-primary-500 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Xem chi tiết ➔
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
