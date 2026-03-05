import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";
import { Crown, Medal } from "lucide-react";
import { Panel } from "@/components/shared/panel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeaderboardPage() {
  noStore();
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("leaderboard_global")
    .select("guest_id, display_name, total_score_all_time, matches_played, updated_at")
    .order("total_score_all_time", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(10);

  return (
    <Panel className="space-y-4 bg-white/95 sm:space-y-5">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">Global Leaderboard</h1>
        <p className="text-sm font-semibold text-slate-600">
          Top 10 players by accumulated score across all matches.
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1.5">Realtime rank summary</span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">Sorted by all-time score</span>
        </div>
      </div>

      <div className="space-y-2 md:hidden">
        {(data ?? []).map((row, index) => (
          <div
            key={row.guest_id}
            className={`flex items-center justify-between rounded-2xl border px-3 py-3 shadow-sm ${
              index === 0
                ? "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50"
                : index === 1
                  ? "border-slate-300 bg-gradient-to-r from-slate-50 to-slate-100"
                  : index === 2
                    ? "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                {index === 0 ? (
                  <Crown size={16} className="text-amber-500" />
                ) : index === 1 ? (
                  <Medal size={16} className="text-slate-400" />
                ) : index === 2 ? (
                  <Medal size={16} className="text-orange-400" />
                ) : (
                  <span className="text-sm font-extrabold text-slate-700">{index + 1}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{row.display_name}</p>
                <p className="text-xs font-semibold text-slate-500">{row.matches_played} matches</p>
              </div>
            </div>
            <p className="text-lg font-extrabold text-slate-900">{row.total_score_all_time}</p>
          </div>
        ))}
        {(data?.length ?? 0) === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-6 text-center text-sm text-slate-500">
            No leaderboard data yet. Finish at least one room game first.
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Player</th>
              <th className="px-3 py-2 text-right">All-time Score</th>
              <th className="px-3 py-2 text-right">Matches</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row, index) => (
              <tr key={row.guest_id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-semibold">{index + 1}</td>
                <td className="px-3 py-2">{row.display_name}</td>
                <td className="px-3 py-2 text-right font-semibold">{row.total_score_all_time}</td>
                <td className="px-3 py-2 text-right">{row.matches_played}</td>
              </tr>
            ))}
            {(data?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                  No leaderboard data yet. Finish at least one room game first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
