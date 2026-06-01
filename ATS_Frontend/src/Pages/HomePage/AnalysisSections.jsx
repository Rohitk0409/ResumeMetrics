import {
  Brain,
  CheckCircle,
  FileText,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  {
    icon: FileText,
    text: "Reading Uploaded Resumes",
    detail: "Parsing document structure & content",
  },
  {
    icon: Search,
    text: "Extracting Candidate Info",
    detail: "Identifying skills, experience & education",
  },
  {
    icon: FileText,
    text: "Parsing Job Description",
    detail: "Understanding role requirements",
  },
  {
    icon: Target,
    text: "Matching Skills & Experience",
    detail: "Cross-referencing candidate profiles",
  },
  {
    icon: Brain,
    text: "Calculating ATS Score",
    detail: "Running intelligent scoring algorithms",
  },
  {
    icon: Sparkles,
    text: "Generating AI Insights",
    detail: "Crafting personalized recommendations",
  },
  {
    icon: CheckCircle,
    text: "Preparing Final Rankings",
    detail: "Sorting candidates by best fit",
  },
];

export default function AnalysisSections() {
  const [activeStep, setActiveStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    const tickTimer = setInterval(() => setTick((t) => t + 1), 500);
    return () => {
      clearInterval(stepTimer);
      clearInterval(tickTimer);
    };
  }, []);

  const CurrentIcon = steps[activeStep].icon;
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);
  const dots = ".".repeat((tick % 3) + 1).padEnd(3, "\u00a0");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, #0a1628 0%, #020810 100%)",
      }}
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
      />

      <div className="relative w-full max-w-lg mx-4">
        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "rgba(15,23,42,0.95)",
            borderColor: "rgba(16,185,129,0.2)",
            boxShadow:
              "0 0 60px rgba(16,185,129,0.08), 0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Top badge */}
          <div className="flex justify-center mb-6">
            <span
              className="text-xs font-semibold tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#10b981",
              }}
            >
              AI ENGINE ACTIVE
            </span>
          </div>

          {/* Central icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{
                  background: "linear-gradient(135deg, #10b981, #3b82f6)",
                }}
              />
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #10b981, #3b82f6)",
                  boxShadow: "0 0 30px rgba(16,185,129,0.4)",
                }}
              >
                <Brain size={36} className="text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-white mb-1 tracking-tight">
            Analyzing Resumes
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: "#64748b" }}>
            Powered by advanced AI • Please wait
          </p>

          {/* Active step card */}
          <div
            className="rounded-xl p-4 mb-6 flex items-center gap-4"
            style={{
              background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.15)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))",
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              <CurrentIcon size={22} style={{ color: "#10b981" }} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm">
                {steps[activeStep].text}
                {dots}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                {steps[activeStep].detail}
              </p>
            </div>
            <div className="ml-auto flex gap-1 flex-shrink-0">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#10b981",
                    opacity: tick % 3 === i ? 1 : 0.2,
                    transition: "opacity 0.3s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-xs font-medium"
                style={{ color: "#64748b" }}
              >
                Processing
              </span>
              <span className="text-xs font-bold" style={{ color: "#10b981" }}>
                {progress}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #10b981, #3b82f6)",
                  boxShadow: "0 0 12px rgba(16,185,129,0.5)",
                }}
              />
            </div>
          </div>

          {/* Completed steps */}
          {activeStep > 0 && (
            <div className="space-y-1.5">
              {steps.slice(0, activeStep).map((step, i) => (
                <div key={i} className="flex items-center gap-2.5 py-1">
                  <CheckCircle
                    size={14}
                    style={{ color: "#10b981", flexShrink: 0 }}
                  />
                  <span className="text-xs" style={{ color: "#475569" }}>
                    {step.text}
                  </span>
                  <span
                    className="ml-auto text-xs font-medium"
                    style={{ color: "#10b981" }}
                  >
                    Done
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
