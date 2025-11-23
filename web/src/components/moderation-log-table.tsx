"use client";

type ModerationLog = {
  id: number;
  moderator_id: string;
  target_user_id: string;
  action: string;
  reason: string | null;
  sphere_id: string | null;
  created_at: string;
};

export function ModerationLogTable({ logs }: { logs: ModerationLog[] }) {
  if (!logs.length) {
    return (
      <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 text-center text-sm text-[#22223B]/70 shadow">
        No moderation events logged yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow">
      <table className="min-w-full text-left text-sm text-[#22223B]">
        <thead className="bg-[#FFF1EB] text-xs uppercase tracking-[0.3em] text-[#22223B]/60">
          <tr>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Moderator</th>
            <th className="px-4 py-3">Target</th>
            <th className="px-4 py-3">Sphere</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-white/50">
              <td className="px-4 py-3 font-semibold">{log.action}</td>
              <td className="px-4 py-3 text-xs">{log.moderator_id}</td>
              <td className="px-4 py-3 text-xs">{log.target_user_id}</td>
              <td className="px-4 py-3 text-xs">{log.sphere_id || "n/a"}</td>
              <td className="px-4 py-3 text-xs">{log.reason || "-"}</td>
              <td className="px-4 py-3 text-xs">{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

