import {
  Award,
  BarChart2,
  CheckCircle2,
  Medal,
  TrendingUp,
  Trophy,
  X,
  XCircle,
} from "lucide-react";

const rankConfig = {
  1: {
    icon: Trophy,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    label: "Top Pick",
  },
  2: {
    icon: Medal,
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.2)",
    label: "Runner Up",
  },
  3: {
    icon: Award,
    color: "#cd7c54",
    bg: "rgba(205,124,84,0.08)",
    border: "rgba(205,124,84,0.2)",
    label: "3rd Place",
  },
};

function ScoreBar({ score }) {
  const color =
    score >= 80
      ? "#10b981"
      : score >= 60
        ? "#3b82f6"
        : score >= 40
          ? "#f59e0b"
          : "#ef4444";
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

function RankBadge({ rank }) {
  const cfg = rankConfig[rank] || {
    icon: BarChart2,
    color: "#64748b",
    bg: "rgba(100,116,139,0.08)",
    border: "rgba(100,116,139,0.2)",
    label: `#${rank}`,
  };
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
      >
        <Icon size={15} style={{ color: cfg.color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: cfg.color }}>
        {cfg.label || `#${rank}`}
      </span>
    </div>
  );
}

export default function ResultsDashboard({ result, onClose }) {
  if (!result) return null;

  const candidates = result?.ranking ?? [];
  const topScore = candidates[0]?.atsScore ?? 0;
  const avgScore = candidates.length
    ? Math.round(
        candidates.reduce((s, c) => s + (c.atsScore ?? 0), 0) /
          candidates.length,
      )
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "rgba(10,18,35,0.98)",
          border: "1px solid rgba(16,185,129,0.15)",
          boxShadow:
            "0 0 80px rgba(16,185,129,0.06), 0 30px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                boxShadow: "0 0 20px rgba(16,185,129,0.3)",
              }}
            >
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                ATS Analysis Results
              </h2>
              <p className="text-xs" style={{ color: "#475569" }}>
                {candidates.length} candidate
                {candidates.length !== 1 ? "s" : ""} ranked by AI
              </p>
            </div>
          </div>

          {/* Summary pills */}
          <div className="hidden sm:flex items-center gap-3 mr-4">
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#10b981",
              }}
            >
              Top: {topScore}%
            </div>
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "#60a5fa",
              }}
            >
              Avg: {avgScore}%
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <X size={16} style={{ color: "#94a3b8" }} />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <XCircle size={40} style={{ color: "#334155" }} />
              <p style={{ color: "#475569" }}>No results to display</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead
                className="sticky top-0"
                style={{ background: "rgba(10,18,35,0.98)" }}
              >
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {["Rank", "Candidate", "ATS Score", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold tracking-widest uppercase"
                      style={{ color: "#475569" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, idx) => {
                  const isTop = candidate.rank === 1;
                  const score = candidate.atsScore ?? 0;
                  const statusColor =
                    score >= 75
                      ? "#10b981"
                      : score >= 50
                        ? "#3b82f6"
                        : "#f59e0b";
                  const statusLabel =
                    score >= 75
                      ? "Highly Recommended"
                      : score >= 50
                        ? "Good Match"
                        : "Partial Match";
                  const StatusIcon =
                    score >= 75
                      ? CheckCircle2
                      : score >= 50
                        ? BarChart2
                        : TrendingUp;

                  return (
                    <tr
                      key={candidate.rank ?? idx}
                      className="transition-all duration-150 group"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        background: isTop
                          ? "rgba(16,185,129,0.03)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.025)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = isTop
                          ? "rgba(16,185,129,0.03)"
                          : "transparent")
                      }
                    >
                      <td className="px-6 py-4 w-36">
                        <RankBadge rank={candidate.rank} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "#94a3b8",
                            }}
                          >
                            {(candidate.candidateName ?? "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-white text-sm">
                            {candidate.candidateName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 w-52">
                        <ScoreBar score={score} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            size={14}
                            style={{ color: statusColor }}
                          />
                          <span
                            className="text-xs font-medium"
                            style={{ color: statusColor }}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="text-xs" style={{ color: "#334155" }}>
            AI-powered analysis • Results may vary
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              color: "white",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
