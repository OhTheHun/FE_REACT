import { useState, useRef } from 'react';

const MockupUI = ({ isDark }) => {
  return (
    <div className={`w-full h-full p-4 flex gap-6 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar */}
      <div className={`w-1/4 h-full rounded-2xl p-4 flex flex-col gap-4 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`h-6 w-24 rounded-md mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-sm ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <div className={`h-4 w-full rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`flex-1 h-full rounded-2xl p-8 border flex flex-col gap-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className={`h-10 w-3/4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        <div className="flex flex-col gap-3">
          <div className={`h-4 w-full rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          <div className={`h-4 w-full rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          <div className={`h-4 w-5/6 rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        </div>
        
        <div className={`flex-1 rounded-xl mt-4 border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} p-6 flex flex-col gap-4`}>
           <div className={`h-6 w-1/3 rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}></div>
           <div className={`h-32 w-full rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default function ThemeShowcase() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  return (
    <section className="w-full max-w-6xl mx-auto my-16 px-4">
      <div className="text-center mb-10 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Trải nghiệm giao diện hoàn hảo
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Chế độ sáng hay tối, JotDown luôn mang lại cảm giác tập trung tuyệt đối. (Di chuột để xem)
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden cursor-ew-resize border border-slate-200 dark:border-slate-800 shadow-2xl"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Light Mode Layer (Base) */}
        <div className="absolute inset-0 select-none">
          <MockupUI isDark={false} />
        </div>

        {/* Dark Mode Layer (Clipped) */}
        <div 
          className="absolute inset-0 select-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <MockupUI isDark={true} />
        </div>

        {/* Divider Line */}
        <div 
          className="absolute inset-y-0 w-1 bg-blue-500 transform -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          {/* Slider Handle */}
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg pointer-events-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white transform -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
