import Link from "next/link";
import { Clock3, QrCode, Sparkles, Trophy, UsersRound } from "lucide-react";
import { JoinRoomForm } from "@/components/shared/join-room-form";
import { Panel } from "@/components/shared/panel";

export default function HomePage() {
  return (
    <div className="relative space-y-6 pb-6 sm:space-y-8 sm:pb-8">
      <section className="mx-auto max-w-4xl text-center">
        <div className="hero-reveal inline-flex max-w-full items-center gap-2 rounded-3xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_20px_38px_-28px_rgba(15,23,42,0.65)] sm:gap-3 sm:px-5 sm:py-4">
          <Sparkles className="h-6 w-6 text-amber-500 sm:h-7 sm:w-7" />
          <h1 className="font-display gradient-title text-3xl font-extrabold leading-none sm:text-6xl">
            Seachan Quiz
          </h1>
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-lg font-semibold leading-relaxed text-slate-700 sm:mt-6 sm:text-3xl">
          Showcase project: a real-time quiz game. Create a room, scan the QR join, live leaderboard.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700 sm:mt-5 sm:gap-3 sm:text-sm">
          <span className="rounded-full bg-white/85 px-4 py-2 shadow-sm ring-1 ring-white">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Live rooms
          </span>
          <span className="rounded-full bg-white/85 px-4 py-2 shadow-sm ring-1 ring-white">QR join</span>
          <span className="rounded-full bg-white/85 px-4 py-2 shadow-sm ring-1 ring-white">
            Up to 50 members loh ya
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Panel className="card-lift stagger-in space-y-4 p-5 [animation-delay:80ms] sm:space-y-5 sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 sm:h-20 sm:w-20">
            <UsersRound className="h-8 w-8 text-sky-600 sm:h-10 sm:w-10" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">Join a Game</h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Enter a room code or scan the host QR to jump straight into the arena.
            </p>
          </div>
          <JoinRoomForm />
        </Panel>

        <Panel className="card-lift stagger-in flex flex-col justify-between space-y-5 p-5 [animation-delay:170ms] sm:space-y-6 sm:p-8">
          <div className="space-y-3 text-center sm:space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 sm:h-20 sm:w-20">
              <Trophy className="h-8 w-8 text-orange-600 sm:h-10 sm:w-10" />
            </div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">Host a Game</h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Create a room in one click, show the QR, and run interactive live quiz rounds.
            </p>
          </div>
          <Link
            href="/host"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-400 px-5 py-4 text-xl font-extrabold text-white shadow-[0_24px_45px_-30px_rgba(225,29,72,0.8)] transition hover:-translate-y-0.5 hover:brightness-105 sm:px-6 sm:py-5 sm:text-3xl"
          >
            Quick Start Host Mode
          </Link>
          <p className="text-center text-sm font-semibold text-slate-500">
            fast setup built for live competition
          </p>
        </Panel>
      </section>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <Panel className="card-lift stagger-in space-y-2 p-5 [animation-delay:230ms]">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100">
            <QrCode className="h-6 w-6 text-brand-700" />
          </div>
          <h3 className="font-display text-lg font-extrabold">QR Join Flow</h3>
          <p className="text-sm text-slate-600">Players just scan and play, no signup required.</p>
        </Panel>
        <Panel className="card-lift stagger-in space-y-2 p-5 [animation-delay:280ms]">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <Clock3 className="h-6 w-6 text-emerald-700" />
          </div>
          <h3 className="font-display text-lg font-extrabold">Timer + Speed Bonus</h3>
          <p className="text-sm text-slate-600">Faster correct answers earn more points automatically.</p>
        </Panel>
        <Panel className="card-lift stagger-in space-y-2 p-5 [animation-delay:330ms]">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-display text-lg font-extrabold">Global Top 10</h3>
          <p className="text-sm text-slate-600">Track top players across all finished matches.</p>
          <Link href="/leaderboard" className="text-sm font-extrabold text-brand-700">
            View Leaderboard
          </Link>
        </Panel>
      </section>
    </div>
  );
}
