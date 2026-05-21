import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 px-6 py-16 sm:px-12 sm:py-24">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-900/20" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      
      <div className="relative container mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8 max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]">
            Your mind, perfectly organized.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            JotDown is the minimal, distraction-free personal workspace designed to help you capture ideas, organize knowledge, and focus on what truly matters.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-6 py-3 font-medium shadow-md transition-colors">
              Get Started for Free
            </Link>
          </div>
        </div>
        
        {/* Mockup UI container */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none shadow-2xl rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col h-[400px] bg-[#EEF2FF] dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            {/* Mockup Header */}
            <div className="h-4"></div>
            {/* Mockup Body */}
            <div className="flex flex-1 px-4 pb-4 gap-4">
              {/* Sidebar */}
              <div className="w-1/3 bg-white/60 dark:bg-slate-900/60 rounded-xl p-4 space-y-4 shadow-sm backdrop-blur-sm">
                <div className="h-4 w-3/4 bg-blue-100 dark:bg-blue-900/50 rounded-md"></div>
                <div className="space-y-3 mt-8">
                  <div className="h-3 w-full bg-blue-100/50 dark:bg-slate-700 rounded-md"></div>
                  <div className="h-3 w-5/6 bg-blue-100/50 dark:bg-slate-700 rounded-md"></div>
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1 bg-white/80 dark:bg-slate-900/80 rounded-xl p-6 shadow-sm backdrop-blur-sm">
                <div className="h-6 w-1/2 bg-blue-100 dark:bg-slate-700 rounded-md mb-8"></div>
                <div className="space-y-4">
                  <div className="h-3 w-full bg-blue-50 dark:bg-slate-800 rounded-md"></div>
                  <div className="h-3 w-full bg-blue-50 dark:bg-slate-800 rounded-md"></div>
                  <div className="h-3 w-3/4 bg-blue-50 dark:bg-slate-800 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
