import Link from "next/link"
import { ArrowRight, CalendarDays, PencilRuler, TimerReset } from "lucide-react"

const quickLinks = [
  {
    href: "/editor",
    title: "Build",
    description: "Create a new performance and add cues.",
    icon: PencilRuler,
    tone: "from-amber-500/16 to-transparent",
  },
  {
    href: "/edit",
    title: "Edit",
    description: "Open a saved performance and update it.",
    icon: TimerReset,
    tone: "from-emerald-500/16 to-transparent",
  },
  {
    href: "/schedule",
    title: "Schedule",
    description: "View the published run of show.",
    icon: CalendarDays,
    tone: "from-sky-500/16 to-transparent",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_24%),linear-gradient(180deg,#0b1020_0%,#090d18_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid w-full gap-4 md:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href} className="group">
                <article
                  className={`h-full rounded-[28px] border border-white/10 bg-gradient-to-br ${item.tone} bg-[#0f172a] p-6 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.75)] transition duration-200 hover:-translate-y-1 hover:border-white/20`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>

                  <h1 className="mt-12 text-3xl font-semibold tracking-tight text-white">{item.title}</h1>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                </article>
              </Link>
            )
          })}
        </section>
      </div>
    </div>
  )
}
