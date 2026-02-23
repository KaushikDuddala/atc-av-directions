import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Edit3, Radio, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-6">
            <div className="inline-block p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-6">
              <div className="w-8 h-8 text-blue-400">◆</div>
            </div>
          </div>
          <h1 className="text-6xl font-black mb-3 tracking-tight">AV Directions</h1>
          <p className="text-xl text-slate-400">Professional lighting control for performances</p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Performance */}
          <Link href="/editor">
            <div className="group relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
              <div className="relative flex flex-col items-center justify-center h-full gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white text-sm">New Performance</div>
                  <div className="text-xs text-slate-400 mt-1">Create with lighting cues</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Edit Performance */}
          <Link href="/edit">
            <div className="group relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl hover:border-emerald-500/50 transition-all duration-300 cursor-pointer overflow-hidden h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-300"></div>
              <div className="relative flex flex-col items-center justify-center h-full gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <Edit3 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white text-sm">Edit Performance</div>
                  <div className="text-xs text-slate-400 mt-1">Modify existing shows</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Live */}
          <Link href="/live">
            <div className="group relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl hover:border-red-500/50 transition-all duration-300 cursor-pointer overflow-hidden h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 transition-all duration-300"></div>
              <div className="relative flex flex-col items-center justify-center h-full gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <Radio className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white text-sm">Live Display</div>
                  <div className="text-xs text-slate-400 mt-1">Monitoring & control</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Dashboard */}
          <Link href="/admin">
            <div className="group relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300"></div>
              <div className="relative flex flex-col items-center justify-center h-full gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white text-sm">Admin</div>
                  <div className="text-xs text-slate-400 mt-1">System settings</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
