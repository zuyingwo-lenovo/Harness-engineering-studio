import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  FileText,
  Layers3,
  ShieldCheck,
  ClipboardList,
  Play,
  Search,
  Database,
  Route,
  Lock,
  CheckCircle2,
  CircleDashed,
  Wand2,
} from "lucide-react";

const skillPatterns = [
  {
    id: "intake",
    label: "Problem Intake",
    jp: "問題受理",
    output: ["brief.md"],
    desc: "依頼文を解くべき問題文へ変換し、目的と完了条件を明示する。",
    done: "目的・成果物・前提・未確定事項が brief に揃う。",
    core: true,
  },
  {
    id: "constraints",
    label: "Goal & Constraint Definition",
    jp: "制約定義",
    output: ["constraints.json"],
    desc: "スコープ、納期、品質、安全性、承認条件を制約として機械可読化する。",
    done: "後続タスクが constraints を参照して説明できる。",
    core: true,
  },
  {
    id: "context",
    label: "Context Assembly",
    jp: "文脈整列",
    output: ["context_map.md"],
    desc: "必要情報を must-have / useful / optional に分けて整理する。",
    done: "必要十分な情報だけで次のループを回せる。",
    core: false,
  },
  {
    id: "planning",
    label: "Decomposition & Planning",
    jp: "分解と計画",
    output: ["plan.md", "task_queue.json"],
    desc: "問題を独立検証できる小さなタスク単位に分解する。",
    done: "各タスクに成果物、done 条件、依存関係がある。",
    core: true,
  },
  {
    id: "options",
    label: "Option / Hypothesis Design",
    jp: "選択肢設計",
    output: ["options.md"],
    desc: "比較可能な選択肢を作り、トレードオフを明示する。",
    done: "少なくとも 2 つ以上の案が比較軸つきで並ぶ。",
    core: false,
  },
  {
    id: "execution",
    label: "Tool Execution & Evidence",
    jp: "実行と証拠収集",
    output: ["run_log.md", "evidence/*"],
    desc: "ツール実行、調査、試作の結果を evidence として残す。",
    done: "結果が再現可能で traceable である。",
    core: false,
  },
  {
    id: "synthesis",
    label: "Synthesis & Recommendation",
    jp: "統合と提言",
    output: ["decision.md"],
    desc: "情報を判断へ変換し、推奨と根拠をまとめる。",
    done: "推奨内容と tradeoff が説明可能である。",
    core: true,
  },
  {
    id: "evaluation",
    label: "Verification & Evaluation",
    jp: "検証と評価",
    output: ["eval.md"],
    desc: "factuality、consistency、policy、quality を sensor で検証する。",
    done: "感覚ではなく check 結果で品質が説明できる。",
    core: true,
  },
  {
    id: "handoff",
    label: "Recovery / Handoff / Memory Update",
    jp: "引き継ぎと回復",
    output: ["progress.md", "handoff.md"],
    desc: "未完タスク、rollback point、次の実行条件を明示する。",
    done: "別セッションや別 Agent が再開できる。",
    core: true,
  },
];

const harnessPatterns = [
  {
    id: "artifact-registry",
    label: "Artifact Registry",
    group: "State",
    desc: "brief / plan / eval / handoff を一貫した artifact registry として保持する。",
  },
  {
    id: "progressive-context-loader",
    label: "Progressive Context Loader",
    group: "Context",
    desc: "brief → context map → detail の順に読み込み、ノイズを減らす。",
  },
  {
    id: "task-queue-orchestrator",
    label: "Task Queue Orchestrator",
    group: "Orchestration",
    desc: "1 task = 1 loop で処理し、done 条件ごとに前進させる。",
  },
  {
    id: "tool-sandbox",
    label: "Tool Sandbox",
    group: "Tools",
    desc: "Browser、code、docs などを安全境界つきで利用する。",
  },
  {
    id: "evidence-locker",
    label: "Evidence Locker",
    group: "Observability",
    desc: "検索結果、ログ、比較表、スクリーンショットを証拠として保持する。",
  },
  {
    id: "sensor-pipeline",
    label: "Sensor Pipeline",
    group: "Evaluation",
    desc: "fast checks → rubric → deeper checks → human gate の順に検証する。",
  },
  {
    id: "checkpoint-handoff",
    label: "Checkpoint Handoff",
    group: "Memory",
    desc: "progress file と checkpoint を残し、長いタスクを安全に継続する。",
  },
  {
    id: "policy-rail",
    label: "Policy Rail",
    group: "Governance",
    desc: "禁止事項、承認条件、権限境界を execution 前に確認する。",
  },
  {
    id: "human-gate",
    label: "Human Gate",
    group: "Governance",
    desc: "高リスク判断や不可逆な実行で人の承認を挟む。",
  },
];

const toolOptions = ["web", "files", "docs", "spreadsheets", "slides", "code", "api"];

const defaultInput = {
  projectName: "",
  problem: "",
  desiredOutcome: "",
  stakeholders: "",
  constraints: "",
  evidenceNeed: "medium",
  riskLevel: "medium",
  complexity: "multi-step",
  availableTools: ["web", "files", "code"],
  notes: "",
};

const sampleInput = {
  projectName: "Harnessed Problem-Solving Agent for GTM Analysis",
  problem:
    "新製品ローンチ前に、競合比較、主要論点、意思決定リスクを整理し、AI Agent が継続実行できる問題解決ルーチンを作りたい。",
  desiredOutcome:
    "比較可能な選択肢、評価基準、実行順序、handoff 可能な artifact bundle を含む実行設計を作る。",
  stakeholders: "GTM lead / Product marketing / Regional sales / Executive sponsor",
  constraints:
    "1週間以内に初版、事実誤認を避ける、高リスク判断は human review 必須、出典追跡可能であること。",
  evidenceNeed: "high",
  riskLevel: "high",
  complexity: "multi-actor",
  availableTools: ["web", "files", "docs", "spreadsheets", "code"],
  notes:
    "推奨だけでなく、なぜその組み合わせがよいか、戻り先の loop と artifact 命名も揃えたい。",
};

const fileOrder = [
  "brief.md",
  "constraints.json",
  "context_map.md",
  "plan.md",
  "task_queue.json",
  "options.md",
  "run_log.md",
  "harness_spec.md",
  "decision.md",
  "eval.md",
  "progress.md",
  "handoff.md",
];

const fileLabels = {
  "brief.md": "Brief",
  "constraints.json": "Constraints",
  "context_map.md": "Context",
  "plan.md": "Plan",
  "task_queue.json": "Task Queue",
  "options.md": "Options",
  "run_log.md": "Run Log",
  "harness_spec.md": "Harness Spec",
  "decision.md": "Decision",
  "eval.md": "Evaluation",
  "progress.md": "Progress",
  "handoff.md": "Handoff",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function unique(values) {
  return Array.from(new Set(values));
}

function sortByLibrary(ids, library) {
  return [...ids].sort(
    (a, b) =>
      library.findIndex((item) => item.id === a) - library.findIndex((item) => item.id === b)
  );
}

function bulletize(text) {
  return text
    .split(/\n|;|、|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join("\n");
}

function getPatternById(library, id) {
  return library.find((item) => item.id === id);
}

function getRecommendations(input) {
  const raw = [
    input.projectName,
    input.problem,
    input.desiredOutcome,
    input.stakeholders,
    input.constraints,
    input.notes,
  ]
    .join(" ")
    .toLowerCase();

  const skillIds = ["intake", "constraints", "planning", "synthesis", "evaluation", "handoff"];
  const harnessIds = [
    "artifact-registry",
    "progressive-context-loader",
    "task-queue-orchestrator",
    "sensor-pipeline",
    "checkpoint-handoff",
  ];

  if (
    raw.includes("分析") ||
    raw.includes("調査") ||
    raw.includes("compare") ||
    raw.includes("research") ||
    input.evidenceNeed !== "low"
  ) {
    skillIds.push("context", "options", "execution");
    harnessIds.push("evidence-locker", "tool-sandbox");
  }

  if (input.availableTools.length > 0) {
    skillIds.push("execution");
    harnessIds.push("tool-sandbox");
  }

  if (
    input.riskLevel === "high" ||
    raw.includes("承認") ||
    raw.includes("review") ||
    raw.includes("安全")
  ) {
    harnessIds.push("policy-rail", "human-gate");
  } else {
    harnessIds.push("policy-rail");
  }

  if (input.complexity === "multi-actor" || raw.includes("handoff") || raw.includes("継続")) {
    harnessIds.push("checkpoint-handoff");
  }

  if (raw.includes("選択肢") || raw.includes("意思決定") || raw.includes("提案")) {
    skillIds.push("options", "context");
  }

  return {
    skillIds: sortByLibrary(unique(skillIds), skillPatterns),
    harnessIds: sortByLibrary(unique(harnessIds), harnessPatterns),
  };
}

function generateArtifacts(input, selectedSkillIds, selectedHarnessIds) {
  const selectedSkills = sortByLibrary(selectedSkillIds, skillPatterns).map((id) => getPatternById(skillPatterns, id));
  const selectedHarness = sortByLibrary(selectedHarnessIds, harnessPatterns).map((id) => getPatternById(harnessPatterns, id));

  const artifactMap = {
    "brief.md": `# brief.md\n\n## Project\n${input.projectName || "Untitled Problem"}\n\n## Problem Statement\n${input.problem || "TBD"}\n\n## Desired Outcome\n${input.desiredOutcome || "TBD"}\n\n## Stakeholders\n${input.stakeholders || "TBD"}\n\n## Initial Assumptions\n${input.notes ? bulletize(input.notes) : "- TBD"}\n\n## Completion Signal\n- The agent can explain what success looks like.\n- The artifact bundle is sufficient for the next loop or handoff.`,
    "constraints.json": JSON.stringify(
      {
        scope: input.projectName || "TBD",
        constraints: input.constraints
          ? input.constraints.split(/\n|;|、/).map((item) => item.trim()).filter(Boolean)
          : ["TBD"],
        risk_level: input.riskLevel,
        evidence_need: input.evidenceNeed,
        complexity: input.complexity,
        available_tools: input.availableTools,
        approval_required: input.riskLevel === "high",
      },
      null,
      2
    ),
    "context_map.md": `# context_map.md\n\n## Must-have\n${input.problem ? `- Problem domain facts related to: ${input.problem}` : "- Core facts still missing"}\n${input.constraints ? `- Constraints and non-negotiables: ${input.constraints}` : "- Decision constraints still missing"}\n\n## Useful\n${input.stakeholders ? `- Stakeholder perspective: ${input.stakeholders}` : "- Stakeholder expectations need capture"}\n${input.notes ? `- Working notes: ${input.notes}` : "- Prior notes not yet added"}\n\n## Optional\n- Comparative examples\n- Historical decisions\n- Benchmark references\n\n## Contradictions to Resolve\n- Source freshness\n- Assumption gaps\n- Evidence coverage`,
    "plan.md": `# plan.md\n\n## Sequence\n${selectedSkills
      .map(
        (skill, index) =>
          `${index + 1}. **${skill.label}** — ${skill.desc}  \n   Output: ${skill.output.join(", ")}  \n   Done: ${skill.done}`
      )
      .join("\n\n")}\n\n## Loop Rule\n- 1 task = 1 validation loop\n- After each loop, update progress.md and eval.md\n- If a sensor fails, return to the originating skill rather than forcing forward progress`,
    "task_queue.json": JSON.stringify(
      selectedSkills.map((skill, index) => ({
        id: `task-${String(index + 1).padStart(2, "0")}`,
        skill: skill.label,
        artifact: skill.output,
        status: index === 0 ? "ready" : "queued",
        done_criteria: skill.done,
      })),
      null,
      2
    ),
    "options.md": `# options.md\n\n## Option A — Lean Harness\n- Use core skills only\n- Best when the problem is bounded and review overhead must stay low\n\n## Option B — Evidence-Driven Harness\n- Add context assembly, tool execution, evidence locker, sensor pipeline\n- Best when factual risk is high\n\n## Option C — Long-Running Multi-Actor Harness\n- Add checkpoint handoff, human gate, policy rail, artifact registry\n- Best when multiple sessions or approvals are expected\n\n## Current Recommendation\n- Prefer the combination that matches risk level **${input.riskLevel}** and complexity **${input.complexity}**.`,
    "run_log.md": `# run_log.md\n\n## Execution Notes\n- Initialize with brief.md and constraints.json\n- Load context progressively\n- Execute one task at a time\n- Capture evidence before synthesis\n- Run sensors before final recommendation\n\n## Expected Tools\n${input.availableTools.length ? input.availableTools.map((tool) => `- ${tool}`).join("\n") : "- TBD"}`,
    "harness_spec.md": `# harness_spec.md\n\n## Selected Harness Patterns\n${selectedHarness.map((item) => `- **${item.label}** (${item.group}) — ${item.desc}`).join("\n")}\n\n## Operating Rules\n- Artifacts are the source of truth, not volatile chat memory.\n- The agent must move through brief → constraints → context → plan → execution → evaluation → handoff.\n- High-risk actions require a policy check and, when enabled, a human gate.\n\n## Composition Summary\n- Skills: ${selectedSkills.map((item) => item.label).join(" / ")}\n- Harness: ${selectedHarness.map((item) => item.label).join(" / ")}`,
    "decision.md": `# decision.md\n\n## Recommended Combination\n${input.projectName || "This project"} should use a problem-solving routine anchored by **${selectedSkills[0]?.label || "Problem Intake"}** and stabilized by **${selectedHarness[0]?.label || "Artifact Registry"}**.\n\n## Why this works\n- The selected skills cover framing, decomposition, execution, evaluation, and handoff.\n- The selected harness patterns protect state, tool use, and quality gates.\n- The bundle is execution-ready once the remaining missing inputs are filled.\n\n## Open Risks\n- Missing domain facts\n- Conflicting stakeholder expectations\n- Under-specified success criteria`,
    "eval.md": `# eval.md\n\n## Fast Checks\n- Problem statement present\n- Desired outcome present\n- Constraints captured\n- At least one evaluation sensor selected\n\n## Deeper Checks\n- Evidence traceability\n- Tradeoff clarity\n- Policy compliance\n- Handoff completeness\n\n## Review Rule\n- If a check fails, return to the artifact that caused the failure and regenerate only that loop.`,
    "progress.md": `# progress.md\n\n## Current State\n- Intake: ${selectedSkillIds.includes("intake") ? "enabled" : "disabled"}\n- Planning: ${selectedSkillIds.includes("planning") ? "enabled" : "disabled"}\n- Execution: ${selectedSkillIds.includes("execution") ? "enabled" : "disabled"}\n- Evaluation: ${selectedSkillIds.includes("evaluation") ? "enabled" : "disabled"}\n\n## Next Loop\n- Refresh context if new evidence appears\n- Advance the next queued task\n- Re-run eval before publishing`,
    "handoff.md": `# handoff.md\n\n## What is ready\n- Core inputs have been transformed into an artifact bundle\n- Harness patterns are selected and named\n\n## What remains\n- Fill any TBD fields\n- Attach domain evidence\n- Approve high-risk actions if required\n\n## Restart Point\n1. Open brief.md\n2. Confirm constraints.json\n3. Resume from the first queued task in task_queue.json`,
  };

  return artifactMap;
}

function bundleMarkdown(artifacts) {
  return fileOrder
    .filter((file) => artifacts[file])
    .map((file) => `# ${file}\n\n\
${artifacts[file]}\n`)
    .join("\n\n");
}

function downloadTextFile(filename, content, mime = "text/plain;charset=utf-8") {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function MetricCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-2">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{note}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function Area({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TogglePill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1.5 text-sm transition",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      )}
    >
      {children}
    </button>
  );
}

function PatternCard({ title, subtitle, desc, selected, recommended, onToggle, badge }) {
  return (
    <button
      onClick={onToggle}
      className={cx(
        "w-full rounded-2xl border p-4 text-left shadow-sm transition",
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">{title}</div>
            {badge ? (
              <span
                className={cx(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium",
                  selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"
                )}
              >
                {badge}
              </span>
            ) : null}
          </div>
          <div className={cx("mt-1 text-xs", selected ? "text-slate-300" : "text-slate-500")}>{subtitle}</div>
        </div>
        {selected ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <CircleDashed className="h-5 w-5 shrink-0" />}
      </div>
      <p className={cx("mt-3 text-sm leading-6", selected ? "text-slate-200" : "text-slate-600")}>{desc}</p>
      {recommended ? (
        <div className={cx("mt-3 text-xs font-medium", selected ? "text-slate-100" : "text-slate-700")}>
          Recommended for the current input
        </div>
      ) : null}
    </button>
  );
}

export default function HarnessEngineeringStudio() {
  const [input, setInput] = useState(defaultInput);
  const initialRecommendation = getRecommendations(defaultInput);
  const [selectedSkillIds, setSelectedSkillIds] = useState(initialRecommendation.skillIds);
  const [selectedHarnessIds, setSelectedHarnessIds] = useState(initialRecommendation.harnessIds);
  const [activeTab, setActiveTab] = useState("routine");
  const [artifactTab, setArtifactTab] = useState("brief.md");
  const [patternQuery, setPatternQuery] = useState("");
  const [bundleOutOfDate, setBundleOutOfDate] = useState(true);
  const [artifacts, setArtifacts] = useState(() =>
    generateArtifacts(defaultInput, initialRecommendation.skillIds, initialRecommendation.harnessIds)
  );

  const recommendation = useMemo(() => getRecommendations(input), [input]);

  const selectedSkills = useMemo(
    () => sortByLibrary(selectedSkillIds, skillPatterns).map((id) => getPatternById(skillPatterns, id)),
    [selectedSkillIds]
  );

  const selectedHarness = useMemo(
    () => sortByLibrary(selectedHarnessIds, harnessPatterns).map((id) => getPatternById(harnessPatterns, id)),
    [selectedHarnessIds]
  );

  const harnessGroupsCovered = unique(selectedHarness.map((item) => item.group)).length;
  const harnessGroupTotal = unique(harnessPatterns.map((item) => item.group)).length;
  const harnessCoverage = harnessGroupsCovered / harnessGroupTotal;

  const requiredInputFields = [input.problem, input.desiredOutcome, input.stakeholders, input.constraints];
  const inputCompleteness = requiredInputFields.filter((item) => item.trim().length > 0).length / requiredInputFields.length;
  const routineCoverage = skillPatterns.filter((item) => item.core && selectedSkillIds.includes(item.id)).length /
    skillPatterns.filter((item) => item.core).length;

  const blockers = [];
  if (!input.problem.trim()) blockers.push("Problem statement");
  if (!input.desiredOutcome.trim()) blockers.push("Desired outcome");
  if (!input.stakeholders.trim()) blockers.push("Stakeholders");
  if (!input.constraints.trim()) blockers.push("Constraints");
  if (!selectedHarnessIds.includes("sensor-pipeline")) blockers.push("Evaluation sensor");
  if (!selectedSkillIds.includes("handoff")) blockers.push("Handoff skill");

  const architectureLabel =
    input.complexity === "multi-actor"
      ? "Planner → Generator → Evaluator → Handoff"
      : input.evidenceNeed === "high"
      ? "Evidence-driven task loop"
      : "Lean single-loop routine";

  const bundleString = JSON.stringify(artifacts, null, 2);
  const markdownBundle = bundleMarkdown(artifacts);

  const filteredSkills = skillPatterns.filter((item) => {
    const hay = `${item.label} ${item.jp} ${item.desc}`.toLowerCase();
    return hay.includes(patternQuery.toLowerCase());
  });

  const filteredHarness = harnessPatterns.filter((item) => {
    const hay = `${item.label} ${item.group} ${item.desc}`.toLowerCase();
    return hay.includes(patternQuery.toLowerCase());
  });

  function updateInput(key, value) {
    setInput((prev) => ({ ...prev, [key]: value }));
    setBundleOutOfDate(true);
  }

  function toggleTool(tool) {
    setInput((prev) => ({
      ...prev,
      availableTools: prev.availableTools.includes(tool)
        ? prev.availableTools.filter((item) => item !== tool)
        : [...prev.availableTools, tool],
    }));
    setBundleOutOfDate(true);
  }

  function toggleSkill(id) {
    setSelectedSkillIds((prev) =>
      sortByLibrary(prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id], skillPatterns)
    );
    setBundleOutOfDate(true);
  }

  function toggleHarness(id) {
    setSelectedHarnessIds((prev) =>
      sortByLibrary(prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id], harnessPatterns)
    );
    setBundleOutOfDate(true);
  }

  function applyRecommendation() {
    setSelectedSkillIds(recommendation.skillIds);
    setSelectedHarnessIds(recommendation.harnessIds);
    setBundleOutOfDate(true);
  }

  function regenerateArtifacts() {
    setArtifacts(generateArtifacts(input, selectedSkillIds, selectedHarnessIds));
    setBundleOutOfDate(false);
  }

  function loadExample() {
    const nextRecommendation = getRecommendations(sampleInput);
    setInput(sampleInput);
    setSelectedSkillIds(nextRecommendation.skillIds);
    setSelectedHarnessIds(nextRecommendation.harnessIds);
    setArtifacts(generateArtifacts(sampleInput, nextRecommendation.skillIds, nextRecommendation.harnessIds));
    setBundleOutOfDate(false);
    setActiveTab("routine");
    setArtifactTab("brief.md");
  }

  function updateArtifact(file, value) {
    setArtifacts((prev) => ({ ...prev, [file]: value }));
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Sparkles className="h-4 w-4" />
                Harness Engineering IDE
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Problem-Solving Agent Studio
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                ユーザーの input を確認しながら、問題解決ルーチン、harness 構成、artifact bundle を一気通貫で作るための IDE。
                Skill と Harness を分けて設計し、実行可能な組み合わせに落とします。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadExample}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                サンプルを投入
              </button>
              <button
                onClick={applyRecommendation}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                推奨構成を反映
              </button>
              <button
                onClick={regenerateArtifacts}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Artifact Bundle を再生成
              </button>
              <button
                onClick={() => downloadTextFile("artifact-bundle.json", bundleString, "application/json;charset=utf-8")}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                <Download className="mr-2 inline h-4 w-4" /> JSON
              </button>
              <button
                onClick={() => downloadTextFile("artifact-bundle.md", markdownBundle)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                <Download className="mr-2 inline h-4 w-4" /> Markdown
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
          <MetricCard
            icon={ClipboardList}
            label="Input completeness"
            value={`${Math.round(inputCompleteness * 100)}%`}
            note="問題、成果、関係者、制約が埋まるほど、ルーチンの粒度が安定します。"
          />
          <MetricCard
            icon={Layers3}
            label="Routine coverage"
            value={`${Math.round(routineCoverage * 100)}%`}
            note="core skill の採用率。最低でも intake / planning / evaluation / handoff は欲しい構成です。"
          />
          <MetricCard
            icon={ShieldCheck}
            label="Harness coverage"
            value={`${Math.round(harnessCoverage * 100)}%`}
            note="state / context / orchestration / tools / evaluation / memory の層がどこまで揃っているかを表します。"
          />
          <MetricCard
            icon={bundleOutOfDate ? Wand2 : CheckCircle2}
            label="Bundle status"
            value={bundleOutOfDate ? "Needs refresh" : "Synced"}
            note="input や pattern を更新したら、artifact bundle を再生成して state を揃えます。"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FileText className="h-4 w-4" />
                Input Review
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                ユーザー input を先に整え、その内容に合わせて pattern を絞り込みます。
              </p>

              <div className="mt-5 space-y-4">
                <Field
                  label="Project / Problem Name"
                  value={input.projectName}
                  onChange={(value) => updateInput("projectName", value)}
                  placeholder="例: GTM analysis agent harness"
                />
                <Area
                  label="Problem Statement"
                  value={input.problem}
                  onChange={(value) => updateInput("problem", value)}
                  placeholder="何を解くのかを 1 つの問題文で書く"
                  rows={5}
                />
                <Area
                  label="Desired Outcome"
                  value={input.desiredOutcome}
                  onChange={(value) => updateInput("desiredOutcome", value)}
                  placeholder="最終的にどんな判断、提案、成果物が必要か"
                  rows={4}
                />
                <Field
                  label="Stakeholders"
                  value={input.stakeholders}
                  onChange={(value) => updateInput("stakeholders", value)}
                  placeholder="例: product marketing / sales / exec"
                />
                <Area
                  label="Constraints & Non-negotiables"
                  value={input.constraints}
                  onChange={(value) => updateInput("constraints", value)}
                  placeholder="納期、品質、安全性、承認条件など"
                  rows={4}
                />
                <Area
                  label="Notes / Assumptions"
                  value={input.notes}
                  onChange={(value) => updateInput("notes", value)}
                  placeholder="補足メモ、仮説、既知の前提"
                  rows={3}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Evidence need"
                  value={input.evidenceNeed}
                  onChange={(value) => updateInput("evidenceNeed", value)}
                  options={[
                    { value: "low", label: "low" },
                    { value: "medium", label: "medium" },
                    { value: "high", label: "high" },
                  ]}
                />
                <SelectField
                  label="Risk level"
                  value={input.riskLevel}
                  onChange={(value) => updateInput("riskLevel", value)}
                  options={[
                    { value: "low", label: "low" },
                    { value: "medium", label: "medium" },
                    { value: "high", label: "high" },
                  ]}
                />
                <SelectField
                  label="Complexity"
                  value={input.complexity}
                  onChange={(value) => updateInput("complexity", value)}
                  options={[
                    { value: "single-step", label: "single-step" },
                    { value: "multi-step", label: "multi-step" },
                    { value: "multi-actor", label: "multi-actor" },
                  ]}
                />
              </div>

              <div className="mt-5">
                <div className="mb-2 text-sm font-medium text-slate-700">Available tools</div>
                <div className="flex flex-wrap gap-2">
                  {toolOptions.map((tool) => (
                    <TogglePill
                      key={tool}
                      active={input.availableTools.includes(tool)}
                      onClick={() => toggleTool(tool)}
                    >
                      {tool}
                    </TogglePill>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Lock className="h-4 w-4" />
                  Execution blockers
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {blockers.length ? (
                    blockers.map((blocker) => (
                      <span key={blocker} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                        {blocker}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-xs text-white">
                      Ready for execution
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  input が不足していても設計は進められますが、高リスク task では blocker の解消が先です。
                </p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "routine", label: "Routine Builder" },
                  { id: "harness", label: "Harness Composer" },
                  { id: "artifact", label: "Artifact Workbench" },
                  { id: "runbook", label: "Runbook" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cx(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      activeTab === tab.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="mt-5"
                >
                  {activeTab === "routine" ? (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <Sparkles className="h-4 w-4" />
                          Recommended now
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {recommendation.skillIds.map((id) => {
                            const skill = getPatternById(skillPatterns, id);
                            return (
                              <span key={id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                                {skill.jp}
                              </span>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {recommendation.harnessIds.map((id) => {
                            const harness = getPatternById(harnessPatterns, id);
                            return (
                              <span key={id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                                {harness.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {skillPatterns.map((pattern, index) => (
                          <PatternCard
                            key={pattern.id}
                            title={`${index + 1}. ${pattern.jp}`}
                            subtitle={pattern.label}
                            desc={`${pattern.desc} Output: ${pattern.output.join(", ")}`}
                            selected={selectedSkillIds.includes(pattern.id)}
                            recommended={recommendation.skillIds.includes(pattern.id)}
                            onToggle={() => toggleSkill(pattern.id)}
                            badge={pattern.core ? "core" : "optional"}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "harness" ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <label className="block">
                          <div className="mb-2 text-sm font-medium text-slate-700">Pattern search</div>
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              value={patternQuery}
                              onChange={(e) => setPatternQuery(e.target.value)}
                              placeholder="skill / harness / state / context"
                              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
                            />
                          </div>
                        </label>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          Architecture: <span className="font-semibold text-slate-900">{architectureLabel}</span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 text-sm font-semibold text-slate-900">Skill layer</div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          {filteredSkills.map((pattern) => (
                            <PatternCard
                              key={pattern.id}
                              title={pattern.label}
                              subtitle={pattern.jp}
                              desc={pattern.desc}
                              selected={selectedSkillIds.includes(pattern.id)}
                              recommended={recommendation.skillIds.includes(pattern.id)}
                              onToggle={() => toggleSkill(pattern.id)}
                              badge={pattern.core ? "core" : "optional"}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 text-sm font-semibold text-slate-900">Harness layer</div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          {filteredHarness.map((pattern) => (
                            <PatternCard
                              key={pattern.id}
                              title={pattern.label}
                              subtitle={pattern.group}
                              desc={pattern.desc}
                              selected={selectedHarnessIds.includes(pattern.id)}
                              recommended={recommendation.harnessIds.includes(pattern.id)}
                              onToggle={() => toggleHarness(pattern.id)}
                              badge={pattern.group}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "artifact" ? (
                    <div className="space-y-5">
                      <div className="flex flex-wrap gap-2">
                        {fileOrder.map((file) => (
                          <button
                            key={file}
                            onClick={() => setArtifactTab(file)}
                            className={cx(
                              "rounded-full px-3 py-1.5 text-sm transition",
                              artifactTab === file
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            )}
                          >
                            {fileLabels[file]}
                          </button>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{artifactTab}</div>
                            <div className="text-xs text-slate-500">生成後に手で仕上げられる editable artifact</div>
                          </div>
                          <button
                            onClick={regenerateArtifacts}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                          >
                            この bundle を再生成
                          </button>
                        </div>
                        <textarea
                          value={artifacts[artifactTab] || ""}
                          onChange={(e) => updateArtifact(artifactTab, e.target.value)}
                          className="min-h-[460px] w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-sm leading-6 text-slate-800 outline-none transition focus:border-slate-400"
                        />
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "runbook" ? (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <Play className="h-4 w-4" />
                          Execution architecture
                        </div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">{architectureLabel}</div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          入力の複雑さ、証拠要求、リスクに応じて、lean loop から multi-actor handoff まで切り替えます。
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Route className="h-4 w-4" />
                            Runtime loop
                          </div>
                          <div className="mt-4 space-y-3">
                            {selectedSkills.map((skill, index) => (
                              <div key={skill.id} className="rounded-2xl border border-slate-200 p-3">
                                <div className="text-sm font-semibold text-slate-900">
                                  {index + 1}. {skill.label}
                                </div>
                                <div className="mt-1 text-sm text-slate-600">{skill.done}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Database className="h-4 w-4" />
                            Selected harness stack
                          </div>
                          <div className="mt-4 space-y-3">
                            {selectedHarness.map((item) => (
                              <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                                <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.group}</div>
                                <div className="mt-2 text-sm text-slate-600">{item.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Execution-ready combination</div>
                        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Core artifacts</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {[
                                "brief.md",
                                "constraints.json",
                                "plan.md",
                                "task_queue.json",
                                "eval.md",
                                "handoff.md",
                              ].map((file) => (
                                <span key={file} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                                  {file}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Recommended next action</div>
                            <div className="mt-3 text-sm leading-6 text-slate-700">
                              {bundleOutOfDate
                                ? "入力や pattern が更新されています。Artifact Bundle を再生成して state を揃えてください。"
                                : "Artifact bundle は同期済みです。次は evidence 収集か stakeholder review を開始できます。"}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Governance</div>
                            <div className="mt-3 text-sm leading-6 text-slate-700">
                              {selectedHarnessIds.includes("human-gate")
                                ? "Human gate が有効です。不可逆な判断や publish 前に承認を挟みます。"
                                : "Human gate は無効です。低リスク task を前提に自律実行寄りの構成です。"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
