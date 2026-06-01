import {
  AlignLeft,
  Briefcase,
  CheckCircle,
  FileText,
  Loader2,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../Hooks/api";
import AnalysisSections from "./AnalysisSections";
import ResultsDashboard from "./ResultsDashboard";

const FEATURES = [
  {
    icon: FileText,
    label: "Multiple Resume Upload",
    desc: "Batch-process up to 20 resumes at once",
  },
  {
    icon: UploadCloud,
    label: "JD PDF Upload",
    desc: "Import job descriptions from PDF or Word",
  },
  {
    icon: AlignLeft,
    label: "Paste Job Description",
    desc: "Quickly paste plain-text JD for analysis",
  },
  {
    icon: Zap,
    label: "AI ATS Scoring",
    desc: "Instant intelligent ranking & insights",
  },
];

export default function HomePage() {
  const [resumes, setResumes] = useState([]);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setAnalysis(true);
      const startTime = Date.now();
      const formData = new FormData();
      resumes.forEach((resume) => formData.append("resumeFiles", resume));
      if (jdFile) formData.append("jobDescriptionPdf", jdFile);
      if (jdText.trim()) formData.append("jobDescription", jdText);
      const response = await api.post("/v1/resume/ats", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const elapsed = Date.now() - startTime;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(5000 - elapsed, 0)),
      );
      setResult(response.data);
    } catch (error) {
      console.error("ATS Error =>", error.response?.data || error.message);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.response?.data ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
      setAnalysis(false);
    }
  };

  const canAnalyze = resumes.length > 0 && (jdFile || jdText.trim());

  return (
    <>
      {analysis && <AnalysisSections />}
      <ResultsDashboard result={result} onClose={() => setResult(null)} />

      <div
        className="min-h-screen text-white relative overflow-x-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, #0d1f3c 0%, #020810 55%, #000d1a 100%)",
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
            style={{
              background: "radial-gradient(circle, #10b981, transparent)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl"
            style={{
              background: "radial-gradient(circle, #3b82f6, transparent)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* LEFT */}
            <div className="flex flex-col">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-5">
                AI Resume{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #10b981, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Analyzer
                </span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-10"
                style={{ color: "#64748b" }}
              >
                Upload multiple resumes and rank candidates against any job
                description using advanced AI-powered ATS intelligence.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {FEATURES.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="flex gap-3 p-4 rounded-xl group transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(16,185,129,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)")
                    }
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(16,185,129,0.1)" }}
                    >
                      <Icon size={16} style={{ color: "#10b981" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {label}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#475569" }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div
                className="flex gap-8 mt-10 pt-8"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                {[
                  ["99%", "Accuracy"],
                  ["<5s", "Analysis"],
                  ["20+", "Resumes/Run"],
                ].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #10b981, #3b82f6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {val}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                      {lbl}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Upload Card */}
            <div
              className="rounded-2xl p-7"
              style={{
                background: "rgba(10,18,35,0.9)",
                border: "1px solid rgba(16,185,129,0.15)",
                boxShadow:
                  "0 0 60px rgba(16,185,129,0.05), 0 25px 50px rgba(0,0,0,0.4)",
              }}
            >
              <h2 className="text-xl font-bold text-white mb-6">
                Upload Documents
              </h2>

              {/* Resume Upload */}
              <div className="mb-5">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#94a3b8" }}
                >
                  Resume Files <span style={{ color: "#10b981" }}>*</span>
                </label>
                <label
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl py-6 px-4 text-center transition-all duration-200"
                  style={{
                    background: "rgba(16,185,129,0.04)",
                    border: "1.5px dashed rgba(16,185,129,0.2)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)")
                  }
                >
                  <UploadCloud size={22} style={{ color: "#10b981" }} />
                  <span className="text-sm font-medium text-white">
                    Drop resumes or click to browse
                  </span>
                  <span className="text-xs" style={{ color: "#475569" }}>
                    PDF, DOC, DOCX • Multiple files allowed
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setResumes(Array.from(e.target.files))}
                  />
                </label>
                {resumes.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: "#10b981" }} />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#10b981" }}
                    >
                      {resumes.length} resume{resumes.length > 1 ? "s" : ""}{" "}
                      selected
                    </span>
                    <button onClick={() => setResumes([])} className="ml-auto">
                      <X size={13} style={{ color: "#475569" }} />
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <span className="text-xs" style={{ color: "#334155" }}>
                  JOB DESCRIPTION
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>

              {/* JD Upload */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#94a3b8" }}
                >
                  Upload JD File
                </label>
                <label
                  className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all duration-200"
                  style={{
                    background: "rgba(59,130,246,0.04)",
                    border: "1.5px dashed rgba(59,130,246,0.2)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)")
                  }
                >
                  <Briefcase size={16} style={{ color: "#3b82f6" }} />
                  <span
                    className="text-sm"
                    style={{ color: jdFile ? "#fff" : "#475569" }}
                  >
                    {jdFile ? jdFile.name : "PDF, DOC, DOCX, TXT"}
                  </span>
                  {jdFile && (
                    <button
                      className="ml-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        setJdFile(null);
                      }}
                    >
                      <X size={13} style={{ color: "#475569" }} />
                    </button>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => setJdFile(e.target.files[0])}
                  />
                </label>
              </div>

              {/* JD Text */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#94a3b8" }}
                >
                  Or Paste Job Description
                </label>
                <textarea
                  rows={5}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all duration-200 placeholder-slate-600"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(59,130,246,0.4)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                  }
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !canAnalyze}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background:
                    canAnalyze && !loading
                      ? "linear-gradient(135deg, #10b981, #3b82f6)"
                      : "rgba(255,255,255,0.06)",
                  color: canAnalyze && !loading ? "#fff" : "#334155",
                  cursor: canAnalyze && !loading ? "pointer" : "not-allowed",
                  boxShadow:
                    canAnalyze && !loading
                      ? "0 0 30px rgba(16,185,129,0.25)"
                      : "none",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Analyze Resumes
                  </>
                )}
              </button>

              {!canAnalyze && (
                <p
                  className="text-center text-xs mt-3"
                  style={{ color: "#334155" }}
                >
                  Upload at least one resume and provide a job description
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
