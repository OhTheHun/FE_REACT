function FeatureGrid() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-16 text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Everything you need, nothing you don't.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Designed for clarity and speed, JotDown brings your notes to life with intuitive features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Top Left: Smart Workspaces */}
        <div className="md:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col justify-between overflow-hidden relative min-h-[300px]">
          <div className="z-10 relative mb-8">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Smart Workspaces</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              Organize your life into dedicated contexts. Keep work, personal projects, and hobbies perfectly separated yet instantly accessible.
            </p>
          </div>
          <div className="relative mt-auto w-full h-32 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-t-xl overflow-hidden px-4 pt-4 shadow-sm translate-y-2">
             <div className="flex gap-2 mb-4">
               <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900/50 dark:text-blue-300">Design System</span>
               <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900/50 dark:text-blue-300">Q3 Planning</span>
             </div>
             <div className="space-y-2">
               <div className="w-full h-2 bg-blue-100 dark:bg-slate-800 rounded-full"></div>
               <div className="w-4/5 h-2 bg-blue-100 dark:bg-slate-800 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* Top Right: Real-time Collaboration */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Real-time Collaboration</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Work together seamlessly. Share notes and see changes instantly without refreshing.
            </p>
          </div>
          <div className="flex -space-x-2 mt-8">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium border-2 border-slate-50 dark:border-slate-900">JD</div>
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-medium border-2 border-slate-50 dark:border-slate-900">AL</div>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-medium border-2 border-slate-50 dark:border-slate-900">+3</div>
          </div>
        </div>

        {/* Bottom Left: Advanced Search */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col justify-between">
          <div>
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Advanced Search</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Find anything in milliseconds. Our powerful search understands context and tags.
            </p>
          </div>
          <div className="mt-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex items-center text-slate-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Find "meeting notes"...
          </div>
        </div>

        {/* Bottom Center: Distraction-Free Editor */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col justify-between">
          <div>
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Distraction-Free Editor</h3>
            <p className="text-slate-600 dark:text-slate-400">
              When you start typing, the interface fades away. Focus purely on your words with our fluid, markdown-supported editor designed for flow state.
            </p>
          </div>
        </div>

        {/* Bottom Right: Morning Pages */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col justify-between">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative overflow-hidden mt-auto">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Morning Pages</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
              The sky is clear today, I need to focus on completing the landing page design before noon...
            </p>
            <div className="mt-4 w-1 h-4 bg-blue-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureGrid
