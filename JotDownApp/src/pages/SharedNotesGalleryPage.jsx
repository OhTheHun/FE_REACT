import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/common/Toast'

// Mock categories for modern filters
const CATEGORIES = [
  { id: 'all', label: '⚡ Tất cả' },
  { id: 'tech', label: '💻 Công nghệ & Code' },
  { id: 'study', label: '📚 Học tập' },
  { id: 'life', label: '🌱 Đời sống & Ý tưởng' },
  { id: 'design', label: '🎨 Thiết kế / UI-UX' }
]

const STATIC_SHARED_NOTES = [
  {
    id: 'shared-1',
    title: 'Lộ trình tự học ReactJS từ cơ bản đến nâng cao (2026)',
    content: '1. Học vững HTML5, CSS3, ES6+ (Arrow functions, Destructuring, Promises, Async/Await).\n2. Tìm hiểu React cơ bản: Components, Props, State, Event Handling.\n3. Thành thạo React Hooks thông dụng: useState, useEffect, useContext, useMemo, useCallback.\n4. Quản lý State nâng cao: Redux Toolkit hoặc Zustand.\n5. Tối ưu hiệu năng: React.memo, Lazy Loading, Code Splitting.\n6. Thực hành xây dựng các dự án thực tế để rèn luyện tư duy component.',
    color: '#D1FAE5',
    category: 'tech',
    author: 'Trần Hoàng Nam',
    avatar: 'N',
    role: 'Frontend Dev',
    likes: 142,
    views: '1.2k',
    comments: 24,
    readTime: '5 phút đọc',
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'shared-2',
    title: '10 mẹo CSS cực hay giúp tăng tốc độ thiết kế UI',
    content: '- Sử dụng Flexbox & Grid kết hợp auto-fit/auto-fill cho các bố cục responsive nhanh gọn.\n- Tận dụng CSS Custom Properties (Variables) để dễ quản lý Light/Dark theme.\n- Sử dụng `clamp()` thay vì viết nhiều Media Queries cho font-size.\n- Sử dụng `:focus-within` để tạo hiệu ứng hover/focus viền cho cụm input.\n- Dùng transition cho transform & opacity để chuyển động mượt mà hơn.',
    color: '#FEF3C7',
    category: 'design',
    author: 'Lê Thùy Chi',
    avatar: 'C',
    role: 'UI/UX Designer',
    likes: 98,
    views: '840',
    comments: 12,
    readTime: '3 phút đọc',
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'shared-3',
    title: 'Docker & Containerization cho người mới bắt đầu',
    content: 'Docker là một nền tảng mã nguồn mở giúp tự động hóa việc triển khai ứng dụng dưới dạng các container ảo hóa độc lập.\n\nCác khái niệm cốt lõi:\n- Dockerfile: File cấu hình hướng dẫn build image.\n- Image: Bản đóng gói tĩnh chứa toàn bộ mã nguồn, thư viện.\n- Container: Một instance thực thi hoạt động của image.\n- Docker Compose: Công cụ định nghĩa và chạy nhiều container cùng một lúc bằng file YAML.',
    color: '#DBEAFE',
    category: 'tech',
    author: 'Phạm Đức Anh',
    avatar: 'A',
    role: 'DevOps Engineer',
    likes: 85,
    views: '920',
    comments: 18,
    readTime: '6 phút đọc',
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'shared-4',
    title: 'Phương pháp ghi chép Cornell hiệu quả cho sinh viên',
    content: 'Phương pháp Cornell chia một trang giấy thành 3 phần:\n1. Cột Ghi chép (phải): Viết nhanh các thông tin chính trong bài giảng.\n2. Cột Từ khóa/Câu hỏi (trái): Ghi chú các câu hỏi ôn tập, từ khóa sau buổi học.\n3. Phần Tóm tắt (cuối): Viết 3-4 câu tóm tắt nội dung cốt lõi của cả trang.\n\nGiúp tăng khả năng ghi nhớ và ôn tập thông tin trước kỳ thi cực kì khoa học.',
    color: '#FCE7F3',
    category: 'study',
    author: 'Hoàng Diệu Vy',
    avatar: 'V',
    role: 'Medical Student',
    likes: 215,
    views: '2.4k',
    comments: 45,
    readTime: '4 phút đọc',
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
]

export default function SharedNotesGalleryPage() {
  const navigate = useNavigate()
  const { show } = useToast()
  
  const [sharedNotes, setSharedNotes] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [followedAuthors, setFollowedAuthors] = useState([])

  useEffect(() => {
    let userNotes = []
    try {
      const local = localStorage.getItem('jotdown_notes')
      if (local) {
        const parsed = JSON.parse(local)
        userNotes = parsed
          .filter((n) => n.visibility === 'public')
          .map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            color: n.color || '#7c3aed',
            category: 'life',
            author: 'Bạn (Tôi)',
            avatar: 'U',
            role: 'Thành viên mới',
            likes: 12,
            views: '45',
            comments: 2,
            readTime: '2 phút đọc',
            updatedAt: n.updatedAt || new Date().toISOString()
          }))
      }
    } catch (err) {
      console.error(err)
    }

    setSharedNotes([...userNotes, ...STATIC_SHARED_NOTES])
  }, [])

  const handleLike = (id, e) => {
    e.stopPropagation()
    setSharedNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    )
    show({ type: 'success', message: 'Cộng đồng: Đã lưu lượt thích ghi chú!' })
  }

  const toggleFollow = (author, e) => {
    e.stopPropagation()
    if (followedAuthors.includes(author)) {
      setFollowedAuthors(followedAuthors.filter((a) => a !== author))
      show({ type: 'info', message: `Đã hủy theo dõi ${author}` })
    } else {
      setFollowedAuthors([...followedAuthors, author])
      show({ type: 'success', message: `Đang theo dõi các ghi chú của ${author}` })
    }
  }

  // Filter notes
  const filteredNotes = sharedNotes.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || n.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Featured Note (The one with most likes or design choice)
  const featuredNote = STATIC_SHARED_NOTES[3] // Cornell method note

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
            Khám phá hàng ngàn ghi chú, sơ đồ tư duy, lộ trình học tập được thiết kế sáng tạo bởi cộng đồng JotDown. Chia sẻ kiến thức của bạn để cùng phát triển.
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

      {/* Featured Post Card - Modern Magazine Layout */}
      {featuredNote && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ⭐ Ghi chú tiêu điểm hôm nay
          </h2>
          <div
            onClick={() => navigate(`/shared/note/${featuredNote.id}`)}
            className="group grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Left accent column (md:3) */}
            <div className="md:col-span-4 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 p-8 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-150 dark:border-slate-800">
              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
                  🎯 BÁN CHẠY & NỔI BẬT
                </span>
                <h3 className="text-xl font-black text-slate-850 dark:text-white group-hover:text-primary-500 transition-colors">
                  {featuredNote.title}
                </h3>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {featuredNote.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{featuredNote.author}</h4>
                  <p className="text-[10px] text-slate-400">{featuredNote.role}</p>
                </div>
              </div>
            </div>

            {/* Right details column (md:8) */}
            <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-350 line-clamp-5 leading-relaxed whitespace-pre-wrap">
                {featuredNote.content}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">👁️ {featuredNote.views} lượt xem</span>
                  <span className="flex items-center gap-1">💬 {featuredNote.comments} bình luận</span>
                  <span>⏱️ {featuredNote.readTime}</span>
                </div>
                <button
                  onClick={(e) => handleLike(featuredNote.id, e)}
                  className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>❤️ {featuredNote.likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explorer / Listing Filter menu Section */}
      <div id="explore" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-850 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer
                  ${activeCategory === cat.id
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-450 dark:hover:bg-slate-700'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search tool */}
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
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 text-slate-350 dark:text-slate-700 mb-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">Không tìm thấy ghi chú nào phù hợp</h4>
            <p className="text-xs text-slate-400 mt-1">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc đổi danh mục.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((n) => {
              const isFollowed = followedAuthors.includes(n.author)
              return (
                <div
                  key={n.id}
                  onClick={() => navigate(`/shared/note/${n.id}`)}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Header: Author + follow button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-black text-xs flex items-center justify-center border border-primary-200/30">
                          {n.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-850 dark:text-white line-clamp-1">{n.author}</h4>
                          <span className="text-[10px] text-slate-400 block">{n.role}</span>
                        </div>
                      </div>
                      
                      {n.author !== 'Bạn (Tôi)' && (
                        <button
                          onClick={(e) => toggleFollow(n.author, e)}
                          className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer
                            ${isFollowed
                              ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                              : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-950/20 dark:text-primary-400'
                            }`}
                        >
                          {isFollowed ? '✓ Đang theo' : '+ Theo dõi'}
                        </button>
                      )}
                    </div>

                    {/* Note details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                          🏷️ {n.category === 'tech' ? 'Công nghệ' : n.category === 'design' ? 'Thiết kế' : n.category === 'study' ? 'Học tập' : 'Ý tưởng'}
                        </span>
                        <span className="text-[9px] text-slate-450">{n.readTime}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors">
                        {n.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  </div>

                  {/* Likes views stats at bottom card */}
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-850">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleLike(n.id, e)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 hover:scale-105 transition-all text-[11px] font-bold"
                      >
                        <span>❤️ {n.likes}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">👁️ {n.views}</span>
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
