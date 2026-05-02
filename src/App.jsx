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
  Languages,
  Globe,
} from "lucide-react";

const translations = {
  en: {
    title: "Problem-Solving Agent Studio",
    subtitle: "An IDE for designing problem-solving routines, harness configurations, and artifact bundles seamlessly. Design skills and harnesses separately and convert them into executable combinations.",
    ideLabel: "Harness Engineering IDE",
    loadExample: "Load Example",
    applyRecommendation: "Apply Recommendation",
    regenerateArtifacts: "Regenerate Artifact Bundle",
    inputCompleteness: "Input completeness",
    inputCompletenessNote: "The more the problem, outcome, stakeholders, and constraints are filled, the more stable the routine granularity becomes.",
    routineCoverage: "Routine coverage",
    routineCoverageNote: "Adoption rate of core skills. At minimum, intake / planning / evaluation / handoff are desired.",
    harnessCoverage: "Harness coverage",
    harnessCoverageNote: "Represents the extent to which state / context / orchestration / tools / evaluation / memory layers are covered.",
    bundleStatus: "Bundle status",
    bundleStatusSynced: "Synced",
    bundleStatusNeedsRefresh: "Needs refresh",
    bundleStatusNote: "If input or patterns are updated, regenerate the artifact bundle to sync state.",
    inputReviewTitle: "Input Review",
    inputReviewDesc: "Refine user inputs first, then narrow down patterns based on that content.",
    projectNameLabel: "Project / Problem Name",
    projectNamePlaceholder: "e.g., GTM analysis agent harness",
    problemStatementLabel: "Problem Statement",
    problemStatementPlaceholder: "Write what to solve in a single problem statement",
    desiredOutcomeLabel: "Desired Outcome",
    desiredOutcomePlaceholder: "What final decisions, proposals, or artifacts are needed?",
    stakeholdersLabel: "Stakeholders",
    stakeholdersPlaceholder: "e.g., product marketing / sales / exec",
    constraintsLabel: "Constraints & Non-negotiables",
    constraintsPlaceholder: "Deadlines, quality, safety, approval conditions, etc.",
    notesLabel: "Notes / Assumptions",
    notesPlaceholder: "Supplementary notes, hypotheses, known assumptions",
    evidenceNeedLabel: "Evidence need",
    riskLevelLabel: "Risk level",
    complexityLabel: "Complexity",
    availableToolsLabel: "Available tools",
    executionBlockersTitle: "Execution blockers",
    readyForExecution: "Ready for execution",
    blockersNote: "Design can proceed even if input is insufficient, but for high-risk tasks, clearing blockers is priority.",
    tabRoutine: "Routine Builder",
    tabHarness: "Harness Composer",
    tabArtifact: "Artifact Workbench",
    tabRunbook: "Runbook",
    recommendedNow: "Recommended now",
    patternSearchLabel: "Pattern search",
    patternSearchPlaceholder: "skill / harness / state / context",
    architectureLabel: "Architecture",
    skillLayer: "Skill layer",
    harnessLayer: "Harness layer",
    artifactNote: "Editable artifact that can be finished by hand after generation",
    regenerateThisBundle: "Regenerate this bundle",
    executionArchitecture: "Execution architecture",
    executionArchitectureNote: "Switch from lean loop to multi-actor handoff depending on input complexity, evidence requirements, and risk.",
    runtimeLoop: "Runtime loop",
    selectedHarnessStack: "Selected harness stack",
    executionReadyCombination: "Execution-ready combination",
    coreArtifacts: "Core artifacts",
    recommendedNextAction: "Recommended next action",
    nextActionSynced: "Artifact bundle is synced. Next, you can start evidence collection or stakeholder review.",
    nextActionNeedsRefresh: "Input or patterns have been updated. Regenerate the artifact bundle to sync state.",
    governance: "Governance",
    humanGateEnabled: "Human gate is enabled. Insert approval before irreversible decisions or publishing.",
    humanGateDisabled: "Human gate is disabled. Configuration biased towards autonomous execution for low-risk tasks.",
    badgeCore: "core",
    badgeOptional: "optional",
    recommendedForInput: "Recommended for the current input",
    downloadMarkdown: "Download MD Bundle",
    downloadJSON: "Download JSON Bundle",
    archMultiActor: "Planner → Generator → Evaluator → Handoff",
    archEvidence: "Evidence-driven task loop",
    archLean: "Lean single-loop routine",
    blockerProblem: "Problem statement",
    blockerOutcome: "Desired outcome",
    blockerStakeholders: "Stakeholders",
    blockerConstraints: "Constraints",
    blockerSensor: "Evaluation sensor",
    blockerHandoff: "Handoff skill",
    groupState: "State",
    groupContext: "Context",
    groupOrchestration: "Orchestration",
    groupTools: "Tools",
    groupObservability: "Observability",
    groupEvaluation: "Evaluation",
    groupMemory: "Memory",
    groupGovernance: "Governance",
    levelLow: "low",
    levelMedium: "medium",
    levelHigh: "high",
    compSingle: "single-step",
    compMultiStep: "multi-step",
    compMultiActor: "multi-actor",
    toolWeb: "web",
    toolFiles: "files",
    toolDocs: "docs",
    toolSpreadsheets: "spreadsheets",
    toolSlides: "slides",
    toolCode: "code",
    toolApi: "api",
  },
  zh: {
    title: "问题解决代理工作室",
    subtitle: "一个用于无缝设计问题解决流程、Harness 配置和 Artifact 包的 IDE。分别设计技能和 Harness，并将它们转换为可执行的组合。",
    ideLabel: "Harness 工程 IDE",
    loadExample: "投入示例",
    applyRecommendation: "反映推荐配置",
    regenerateArtifacts: "重新生成 Artifact 包",
    inputCompleteness: "输入完整性",
    inputCompletenessNote: "问题、成果、相关人员、约束填得越满，流程粒度越稳定。",
    routineCoverage: "流程覆盖率",
    routineCoverageNote: "核心技能的采用率。建议至少包含受理、计划、评估和交接。",
    harnessCoverage: "Harness 覆盖率",
    harnessCoverageNote: "表示状态、上下文、编排、工具、评估、内存层的覆盖程度。",
    bundleStatus: "包状态",
    bundleStatusSynced: "已同步",
    bundleStatusNeedsRefresh: "需要刷新",
    bundleStatusNote: "如果更新了输入或模式，请重新生成 Artifact 包以同步状态。",
    inputReviewTitle: "输入审查",
    inputReviewDesc: "先完善用户输入，然后根据该内容缩小模式范围。",
    projectNameLabel: "项目 / 问题名称",
    projectNamePlaceholder: "例：GTM 分析代理 Harness",
    problemStatementLabel: "问题陈述",
    problemStatementPlaceholder: "用一句话写出要解决的问题",
    desiredOutcomeLabel: "期望成果",
    desiredOutcomePlaceholder: "最终需要什么样的判断、建议或成果物？",
    stakeholdersLabel: "相关人员",
    stakeholdersPlaceholder: "例：产品市场 / 销售 / 高管",
    constraintsLabel: "约束与非谈判项",
    constraintsPlaceholder: "交期、质量、安全性、批准条件等",
    notesLabel: "备注 / 假设",
    notesPlaceholder: "补充笔记、假设、已知前提",
    evidenceNeedLabel: "证据需求",
    riskLevelLabel: "风险等级",
    complexityLabel: "复杂性",
    availableToolsLabel: "可用工具",
    executionBlockersTitle: "执行阻碍",
    readyForExecution: "准备执行",
    blockersNote: "即使输入不足也可以进行设计，但在高风险任务中，消除阻碍是首要任务。",
    tabRoutine: "流程构建器",
    tabHarness: "Harness 组合器",
    tabArtifact: "Artifact 工作台",
    tabRunbook: "运行手册",
    recommendedNow: "当前推荐",
    patternSearchLabel: "模式搜索",
    patternSearchPlaceholder: "技能 / harness / 状态 / 上下文",
    architectureLabel: "架构",
    skillLayer: "技能层",
    harnessLayer: "Harness 层",
    artifactNote: "生成后可手动修饰的可编辑 Artifact",
    regenerateThisBundle: "重新生成此包",
    executionArchitecture: "执行架构",
    executionArchitectureNote: "根据输入的复杂性、证据要求和风险，从精简循环切换到多角色交接。",
    runtimeLoop: "运行循环",
    selectedHarnessStack: "选定的 Harness 栈",
    executionReadyCombination: "执行就绪组合",
    coreArtifacts: "核心 Artifacts",
    recommendedNextAction: "推荐的下一步行动",
    nextActionSynced: "Artifact 包已同步。接下来，您可以开始收集证据或进行相关人员审查。",
    nextActionNeedsRefresh: "输入或模式已更新。请重新生成 Artifact 包以同步状态。",
    governance: "治理",
    humanGateEnabled: "人工网关已启用。在不可逆的判断或发布前插入批准。",
    humanGateDisabled: "人工网关已禁用。针对低风险任务的自主执行配置。",
    badgeCore: "核心",
    badgeOptional: "可选",
    recommendedForInput: "针对当前输入的推荐",
    downloadMarkdown: "下载 MD 包",
    downloadJSON: "下载 JSON 包",
    archMultiActor: "策划者 → 生成者 → 评估者 → 交接",
    archEvidence: "证据驱动的任务循环",
    archLean: "精益单循环流程",
    blockerProblem: "问题陈述",
    blockerOutcome: "期望成果",
    blockerStakeholders: "相关人员",
    blockerConstraints: "约束",
    blockerSensor: "评估传感器",
    blockerHandoff: "交接技能",
    groupState: "状态",
    groupContext: "上下文",
    groupOrchestration: "编排",
    groupTools: "工具",
    groupObservability: "可观测性",
    groupEvaluation: "评估",
    groupMemory: "存储",
    groupGovernance: "治理",
    levelLow: "低",
    levelMedium: "中",
    levelHigh: "高",
    compSingle: "单步",
    compMultiStep: "多步",
    compMultiActor: "多角色",
    toolWeb: "网页",
    toolFiles: "文件",
    toolDocs: "文档",
    toolSpreadsheets: "电子表格",
    toolSlides: "幻灯片",
    toolCode: "代码",
    toolApi: "API",
  },
  ja: {
    title: "Problem-Solving Agent Studio",
    subtitle: "ユーザーの input を確認しながら、問題解決ルーチン、harness 構成、artifact bundle を一気通貫で作るための IDE。Skill と Harness を分けて設計し、実行可能な組み合わせに落とします。",
    ideLabel: "Harness Engineering IDE",
    loadExample: "サンプルを投入",
    applyRecommendation: "推奨構成を反映",
    regenerateArtifacts: "Artifact Bundle を再生成",
    inputCompleteness: "Input completeness",
    inputCompletenessNote: "問題、成果、関係者、制約が埋まるほど、ルーチンの粒度が安定します。",
    routineCoverage: "Routine coverage",
    routineCoverageNote: "core skill の採用率。最低でも intake / planning / evaluation / handoff は欲しい構成です。",
    harnessCoverage: "Harness coverage",
    harnessCoverageNote: "state / context / orchestration / tools / evaluation / memory の層がどこまで揃っているかを表します。",
    bundleStatus: "Bundle status",
    bundleStatusSynced: "Synced",
    bundleStatusNeedsRefresh: "Needs refresh",
    bundleStatusNote: "input や pattern を更新したら、artifact bundle を再生成して state を揃えます。",
    inputReviewTitle: "Input Review",
    inputReviewDesc: "ユーザー input を先に整え、その内容に合わせて pattern を絞り込みます。",
    projectNameLabel: "Project / Problem Name",
    projectNamePlaceholder: "例: GTM analysis agent harness",
    problemStatementLabel: "Problem Statement",
    problemStatementPlaceholder: "何を解くのかを 1 つの問題文で書く",
    desiredOutcomeLabel: "Desired Outcome",
    desiredOutcomePlaceholder: "最終的にどんな判断、提案、成果物が必要か",
    stakeholdersLabel: "Stakeholders",
    stakeholdersPlaceholder: "例: product marketing / sales / exec",
    constraintsLabel: "Constraints & Non-negotiables",
    constraintsPlaceholder: "納期、品質、安全性、承認条件など",
    notesLabel: "Notes / Assumptions",
    notesPlaceholder: "補足メモ、仮説、既知の前提",
    evidenceNeedLabel: "Evidence need",
    riskLevelLabel: "Risk level",
    complexityLabel: "Complexity",
    availableToolsLabel: "Available tools",
    executionBlockersTitle: "Execution blockers",
    readyForExecution: "Ready for execution",
    blockersNote: "input が不足していても設計は進められますが、高リスク task では blocker の解消が先です。",
    tabRoutine: "Routine Builder",
    tabHarness: "Harness Composer",
    tabArtifact: "Artifact Workbench",
    tabRunbook: "Runbook",
    recommendedNow: "Recommended now",
    patternSearchLabel: "Pattern search",
    patternSearchPlaceholder: "skill / harness / state / context",
    architectureLabel: "Architecture",
    skillLayer: "Skill layer",
    harnessLayer: "Harness layer",
    artifactNote: "生成後に手で仕上げられる editable artifact",
    regenerateThisBundle: "この bundle を再生成",
    executionArchitecture: "Execution architecture",
    executionArchitectureNote: "入力の複雑さ、証拠要求、リスクに応じて、lean loop から multi-actor handoff まで切り替えます。",
    runtimeLoop: "Runtime loop",
    selectedHarnessStack: "Selected harness stack",
    executionReadyCombination: "Execution-ready combination",
    coreArtifacts: "Core artifacts",
    recommendedNextAction: "Recommended next action",
    nextActionSynced: "Artifact bundle は同期済みです。次は evidence 収集か stakeholder review を開始できます。",
    nextActionNeedsRefresh: "入力や pattern が更新されています。Artifact Bundle を再生成して state を揃えてください。",
    governance: "Governance",
    humanGateEnabled: "Human gate が有効です。不可逆な判断や publish 前に承認を挟みます。",
    humanGateDisabled: "Human gate は無効です。低リスク task を前提に自律実行寄りの構成です。",
    badgeCore: "core",
    badgeOptional: "optional",
    recommendedForInput: "Recommended for the current input",
    downloadMarkdown: "MD Bundle をダウンロード",
    downloadJSON: "JSON Bundle をダウンロード",
    archMultiActor: "Planner → Generator → Evaluator → Handoff",
    archEvidence: "証拠駆動型タスクループ",
    archLean: "リーン・シングルループ",
    blockerProblem: "問題定義",
    blockerOutcome: "期待成果",
    blockerStakeholders: "関係者",
    blockerConstraints: "制約条件",
    blockerSensor: "評価センサ",
    blockerHandoff: "引き継ぎスキル",
    groupState: "State",
    groupContext: "Context",
    groupOrchestration: "Orchestration",
    groupTools: "Tools",
    groupObservability: "Observability",
    groupEvaluation: "Evaluation",
    groupMemory: "Memory",
    groupGovernance: "Governance",
    levelLow: "low",
    levelMedium: "medium",
    levelHigh: "high",
    compSingle: "single-step",
    compMultiStep: "multi-step",
    compMultiActor: "multi-actor",
    toolWeb: "web",
    toolFiles: "files",
    toolDocs: "docs",
    toolSpreadsheets: "spreadsheets",
    toolSlides: "slides",
    toolCode: "code",
    toolApi: "api",
  },
};

const skillPatterns = [
  {
    id: "intake",
    label: { en: "Problem Intake", ja: "問題受理", zh: "问题受理" },
    output: ["brief.md"],
    desc: {
      en: "Transform requests into actionable problem statements with clear goals and completion criteria.",
      ja: "依頼文を解くべき問題文へ変換し、目的と完了条件を明示する。",
      zh: "将需求转换为可解决的问题描述，明确目标和完成条件。",
    },
    done: {
      en: "Goals, deliverables, assumptions, and unknowns are aligned in the brief.",
      ja: "目的・成果物・前提・未確定事項が brief に揃う。",
      zh: "目标、成果物、前提和未确定事项在 brief 中齐全。",
    },
    core: true,
  },
  {
    id: "constraints",
    label: { en: "Goal & Constraint Definition", ja: "制約定義", zh: "约束定义" },
    output: ["constraints.json"],
    desc: {
      en: "Machine-readify scope, deadlines, quality, safety, and approval conditions as constraints.",
      ja: "スコープ、納期、品質、安全性、承認条件を制約として機械可読化する。",
      zh: "将范围、交期、质量、安全性和批准条件作为约束进行机器可读化。",
    },
    done: {
      en: "Subsequent tasks can refer to and explain the constraints.",
      ja: "後続タスクが constraints を参照して説明できる。",
      zh: "后续任务可以引用并说明这些约束。",
    },
    core: true,
  },
  {
    id: "context",
    label: { en: "Context Assembly", ja: "文脈整列", zh: "上下文整列" },
    output: ["context_map.md"],
    desc: {
      en: "Organize necessary information into must-have, useful, and optional categories.",
      ja: "必要情報を must-have / useful / optional に分けて整理する。",
      zh: "将必要信息分为必须、有用和可选类别进行整理。",
    },
    done: {
      en: "Next loop can be run with only sufficient and necessary information.",
      ja: "必要十分な情報だけで次のループを回せる。",
      zh: "仅凭必要且充分的信息即可进行下一个循环。",
    },
    core: false,
  },
  {
    id: "planning",
    label: { en: "Decomposition & Planning", ja: "分解と計画", zh: "分解与计划" },
    output: ["plan.md", "task_queue.json"],
    desc: {
      en: "Decompose the problem into small, independently verifiable task units.",
      ja: "問題を独立検証できる小さなタスク単位に分解する。",
      zh: "将问题分解为可以独立验证的小型任务单元。",
    },
    done: {
      en: "Each task has deliverables, done criteria, and dependencies.",
      ja: "各タスクに成果物、done 条件、依存関係がある。",
      zh: "每个任务都有成果物、完成标准和依赖关系。",
    },
    core: true,
  },
  {
    id: "options",
    label: { en: "Option / Hypothesis Design", ja: "選択肢設計", zh: "选项/假设设计" },
    output: ["options.md"],
    desc: {
      en: "Create comparable options and clarify trade-offs.",
      ja: "比較可能な選択肢を作り、トレードオフを明示する。",
      zh: "创建可比较的选项并明确权衡关系。",
    },
    done: {
      en: "At least two options are listed with comparison criteria.",
      ja: "少なくとも 2 つ以上の案が比較軸つきで並ぶ。",
      zh: "至少并列列出两个以上的方案，并附带比较维度。",
    },
    core: false,
  },
  {
    id: "execution",
    label: { en: "Tool Execution & Evidence", ja: "実行と証拠収集", zh: "执行与证据收集" },
    output: ["run_log.md", "evidence/*"],
    desc: {
      en: "Keep tool execution, investigation, and prototyping results as evidence.",
      ja: "ツール実行、調査、試作の結果を evidence として残す。",
      zh: "将工具执行、调查和原型制作的结果作为证据保留。",
    },
    done: {
      en: "Results are reproducible and traceable.",
      ja: "結果が再現可能で traceable である。",
      zh: "结果是可重现且可追溯的。",
    },
    core: false,
  },
  {
    id: "synthesis",
    label: { en: "Synthesis & Recommendation", ja: "統合と提言", zh: "综合与建议" },
    output: ["decision.md"],
    desc: {
      en: "Transform information into judgment and summarize recommendations and evidence.",
      ja: "情報を判断へ変換し、推奨と根拠をまとめる。",
      zh: "将信息转化为判断，并总结建议和依据。",
    },
    done: {
      en: "Recommendations and trade-offs are explainable.",
      ja: "推奨内容と tradeoff が説明可能である。",
      zh: "建议内容和权衡是可以解释的。",
    },
    core: true,
  },
  {
    id: "evaluation",
    label: { en: "Verification & Evaluation", ja: "検証と評価", zh: "验证与评估" },
    output: ["eval.md"],
    desc: {
      en: "Verify factuality, consistency, policy, and quality using sensors.",
      ja: "factuality、consistency、policy、quality を sensor で検証する。",
      zh: "使用传感器验证事实性、一致性、策略和质量。",
    },
    done: {
      en: "Quality can be explained by check results rather than intuition.",
      ja: "感覚ではなく check 結果で品質が説明できる。",
      zh: "通过检查结果而非感觉来解释质量。",
    },
    core: true,
  },
  {
    id: "handoff",
    label: { en: "Recovery / Handoff / Memory Update", ja: "引き継ぎと回復", zh: "移交与恢复" },
    output: ["progress.md", "handoff.md"],
    desc: {
      en: "Clearly state unfinished tasks, rollback points, and next execution conditions.",
      ja: "未完タスク、rollback point、次の実行条件を明示する。",
      zh: "明确未完成的任务、回滚点和下一个执行条件。",
    },
    done: {
      en: "Another session or agent can resume from here.",
      ja: "別セッションや別 Agent が再開できる。",
      zh: "另一个会话或代理可以从此恢复。",
    },
    core: true,
  },
];

const harnessPatterns = [
  {
    id: "artifact-registry",
    label: { en: "Artifact Registry", ja: "Artifact Registry", zh: "Artifact 注册表" },
    group: "State",
    desc: {
      en: "Maintain brief / plan / eval / handoff as a consistent artifact registry.",
      ja: "brief / plan / eval / handoff を一貫した artifact registry として保持する。",
      zh: "将 brief / plan / eval / handoff 维护为一致 de artifact 注册表。",
    },
  },
  {
    id: "progressive-context-loader",
    label: { en: "Progressive Context Loader", ja: "Progressive Context Loader", zh: "渐进式上下文加载器" },
    group: "Context",
    desc: {
      en: "Load in order of brief → context map → detail to reduce noise.",
      ja: "brief → context map → detail の順に読み込み、ノイズを減らす。",
      zh: "按 brief → context map → detail 的顺序加载，减少噪音。",
    },
  },
  {
    id: "task-queue-orchestrator",
    label: { en: "Task Queue Orchestrator", ja: "Task Queue Orchestrator", zh: "任务队列编排器" },
    group: "Orchestration",
    desc: {
      en: "Process with 1 task = 1 loop and advance for each done condition.",
      ja: "1 task = 1 loop で処理し、done 条件ごとに前進させる。",
      zh: "按 1 任务 = 1 循环处理，并在每个完成条件后推进。",
    },
  },
  {
    id: "tool-sandbox",
    label: { en: "Tool Sandbox", ja: "Tool Sandbox", zh: "工具沙箱" },
    group: "Tools",
    desc: {
      en: "Use browsers, code, docs, etc., with safety boundaries.",
      ja: "Browser、code、docs などを安全境界つきで利用する。",
      zh: "在安全边界内使用浏览器、代码、文档等。",
    },
  },
  {
    id: "evidence-locker",
    label: { en: "Evidence Locker", ja: "Evidence Locker", zh: "证据锁定器" },
    group: "Observability",
    desc: {
      en: "Maintain search results, logs, comparison tables, and screenshots as evidence.",
      ja: "検索結果、ログ、比較表、スクリーンショットを証拠として保持する。",
      zh: "保留搜索结果、日志、对比表和截图作为证据。",
    },
  },
  {
    id: "sensor-pipeline",
    label: { en: "Sensor Pipeline", ja: "Sensor Pipeline", zh: "传感器流水线" },
    group: "Evaluation",
    desc: {
      en: "Verify in order of fast checks → rubric → deeper checks → human gate.",
      ja: "fast checks → rubric → deeper checks → human gate の順に検証する。",
      zh: "按快速检查 → 准则 → 深度检查 → 人工网关的顺序验证。",
    },
  },
  {
    id: "checkpoint-handoff",
    label: { en: "Checkpoint Handoff", ja: "Checkpoint Handoff", zh: "检查点交接" },
    group: "Memory",
    desc: {
      en: "Leave progress files and checkpoints to safely continue long tasks.",
      ja: "progress file と checkpoint を残し、長いタスクを安全に継続する。",
      zh: "保留进度文件和检查点，以便安全地继续长任务。",
    },
  },
  {
    id: "policy-rail",
    label: { en: "Policy Rail", ja: "Policy Rail", zh: "策略轨道" },
    group: "Governance",
    desc: {
      en: "Confirm prohibitions, approval conditions, and authority boundaries before execution.",
      ja: "禁止事項、承認条件、権限境界を execution 前に確認する。",
      zh: "在执行前确认禁止事项、批准条件和权限边界。",
    },
  },
  {
    id: "human-gate",
    label: { en: "Human Gate", ja: "Human Gate", zh: "人工网关" },
    group: "Governance",
    desc: {
      en: "Insert human approval for high-risk judgments or irreversible executions.",
      ja: "高リスク判断や不可逆な実行で人の承認を挟む。",
      zh: "在高风险判断或不可逆执行中插入人工批准。",
    },
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

function generateArtifacts(input, selectedSkillIds, selectedHarnessIds, lang = "en") {
  const selectedSkills = sortByLibrary(selectedSkillIds, skillPatterns).map((id) => getPatternById(skillPatterns, id));
  const selectedHarness = sortByLibrary(selectedHarnessIds, harnessPatterns).map((id) => getPatternById(harnessPatterns, id));

  const getVal = (obj) => (typeof obj === "object" ? obj[lang] || obj["en"] : obj);

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
          `${index + 1}. **${getVal(skill.label)}** — ${getVal(skill.desc)}  \n   Output: ${skill.output.join(", ")}  \n   Done: ${getVal(skill.done)}`
      )
      .join("\n\n")}\n\n## Loop Rule\n- 1 task = 1 validation loop\n- After each loop, update progress.md and eval.md\n- If a sensor fails, return to the originating skill rather than forcing forward progress`,
    "task_queue.json": JSON.stringify(
      selectedSkills.map((skill, index) => ({
        id: `task-${String(index + 1).padStart(2, "0")}`,
        skill: getVal(skill.label),
        artifact: skill.output,
        status: index === 0 ? "ready" : "queued",
        done_criteria: getVal(skill.done),
      })),
      null,
      2
    ),
    "options.md": `# options.md\n\n## Option A — Lean Harness\n- Use core skills only\n- Best when the problem is bounded and review overhead must stay low\n\n## Option B — Evidence-Driven Harness\n- Add context assembly, tool execution, evidence locker, sensor pipeline\n- Best when factual risk is high\n\n## Option C — Long-Running Multi-Actor Harness\n- Add checkpoint handoff, human gate, policy rail, artifact registry\n- Best when multiple sessions or approvals are expected\n\n## Current Recommendation\n- Prefer the combination that matches risk level **${input.riskLevel}** and complexity **${input.complexity}**.`,
    "run_log.md": `# run_log.md\n\n## Execution Notes\n- Initialize with brief.md and constraints.json\n- Load context progressively\n- Execute one task at a time\n- Capture evidence before synthesis\n- Run sensors before final recommendation\n\n## Expected Tools\n${input.availableTools.length ? input.availableTools.map((tool) => `- ${tool}`).join("\n") : "- TBD"}`,
    "harness_spec.md": `# harness_spec.md\n\n## Selected Harness Patterns\n${selectedHarness.map((item) => `- **${getVal(item.label)}** (${item.group}) — ${getVal(item.desc)}`).join("\n")}\n\n## Operating Rules\n- Artifacts are the source of truth, not volatile chat memory.\n- The agent must move through brief → constraints → context → plan → execution → evaluation → handoff.\n- High-risk actions require a policy check and, when enabled, a human gate.\n\n## Composition Summary\n- Skills: ${selectedSkills.map((item) => getVal(item.label)).join(" / ")}\n- Harness: ${selectedHarness.map((item) => getVal(item.label)).join(" / ")}`,
    "decision.md": `# decision.md\n\n## Recommended Combination\n${input.projectName || "This project"} should use a problem-solving routine anchored by **${getVal(selectedSkills[0]?.label) || "Problem Intake"}** and stabilized by **${getVal(selectedHarness[0]?.label) || "Artifact Registry"}**.\n\n## Why this works\n- The selected skills cover framing, decomposition, execution, evaluation, and handoff.\n- The selected harness patterns protect state, tool use, and quality gates.\n- The bundle is execution-ready once the remaining missing inputs are filled.\n\n## Open Risks\n- Missing domain facts\n- Conflicting stakeholder expectations\n- Under-specified success criteria`,
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

function MetricCard({ icon, label, value, note }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-2 flex items-center justify-center">
          {icon}
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

function PatternCard({ title, subtitle, desc, selected, recommended, onToggle, badge, recommendedLabel }) {
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
          {recommendedLabel}
        </div>
      ) : null}
    </button>
  );
}

function LanguageSwitcher({ current, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const langs = [
    { id: "en", label: "English", flag: "EN" },
    { id: "zh", label: "中文", flag: "CN" },
    { id: "ja", label: "日本語", flag: "JP" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            {langs.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  onSelect(lang.id);
                  setIsOpen(false);
                }}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition",
                  current === lang.id
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <span className="w-5 text-[10px] opacity-50 font-bold">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:scale-105 active:scale-95"
      >
        <Globe className="h-6 w-6" />
      </button>
    </div>
  );
}

export default function HarnessEngineeringStudio() {
  const [language, setLanguage] = useState(() => localStorage.getItem("harness_lang") || "ja");
  const [input, setInput] = useState(defaultInput);
  const initialRecommendation = getRecommendations(defaultInput);
  const [selectedSkillIds, setSelectedSkillIds] = useState(initialRecommendation.skillIds);
  const [selectedHarnessIds, setSelectedHarnessIds] = useState(initialRecommendation.harnessIds);
  const [activeTab, setActiveTab] = useState("routine");
  const [artifactTab, setArtifactTab] = useState("brief.md");
  const [patternQuery, setPatternQuery] = useState("");
  const [bundleOutOfDate, setBundleOutOfDate] = useState(true);
  const [artifacts, setArtifacts] = useState(() =>
    generateArtifacts(defaultInput, initialRecommendation.skillIds, initialRecommendation.harnessIds, language)
  );

  const t = (key) => translations[language][key] || key;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("harness_lang", lang);
    setBundleOutOfDate(true);
  };

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
  if (!input.problem.trim()) blockers.push(t("blockerProblem"));
  if (!input.desiredOutcome.trim()) blockers.push(t("blockerOutcome"));
  if (!input.stakeholders.trim()) blockers.push(t("blockerStakeholders"));
  if (!input.constraints.trim()) blockers.push(t("blockerConstraints"));
  if (!selectedHarnessIds.includes("sensor-pipeline")) blockers.push(t("blockerSensor"));
  if (!selectedSkillIds.includes("handoff")) blockers.push(t("blockerHandoff"));

  const architectureLabel =
    input.complexity === "multi-actor"
      ? t("archMultiActor")
      : input.evidenceNeed === "high"
      ? t("archEvidence")
      : t("archLean");

  const bundleString = JSON.stringify(artifacts, null, 2);
  const markdownBundle = bundleMarkdown(artifacts);

  const filteredSkills = skillPatterns.filter((item) => {
    const hay = `${item.label.en} ${item.label.ja} ${item.desc.en}`.toLowerCase();
    return hay.includes(patternQuery.toLowerCase());
  });

  const filteredHarness = harnessPatterns.filter((item) => {
    const hay = `${item.label.en} ${item.group} ${item.desc.en}`.toLowerCase();
    return hay.includes(patternQuery.toLowerCase());
  });

  function updateInput(key, value) {
    setInput((prev) => ({ ...prev, [key]: value }));
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
    setArtifacts(generateArtifacts(input, selectedSkillIds, selectedHarnessIds, language));
    setBundleOutOfDate(false);
  }

  function updateArtifact(file, value) {
    setArtifacts((prev) => ({ ...prev, [file]: value }));
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-900 p-2 text-white">
                <Wand2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("title")}</h1>
            </div>
            <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-slate-200/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              {t("ideLabel")}
            </div>
            <button
              onClick={() => setInput(sampleInput)}
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              {t("loadExample")}
            </button>
            <button
              onClick={applyRecommendation}
              className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("applyRecommendation")}
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label={t("inputCompleteness")}
            value={`${inputCompleteness}%`}
            icon={<CheckCircle2 className={cx("h-5 w-5", inputCompleteness > 80 ? "text-emerald-500" : "text-slate-400")} />}
            note={t("inputCompletenessNote")}
          />
          <MetricCard
            label={t("routineCoverage")}
            value={`${routineCoverage}%`}
            icon={<CircleDashed className={cx("h-5 w-5", routineCoverage > 80 ? "text-emerald-500" : "text-slate-400")} />}
            note={t("routineCoverageNote")}
          />
          <MetricCard
            label={t("harnessCoverage")}
            value={`${harnessCoverage}%`}
            icon={<Database className={cx("h-5 w-5", harnessCoverage > 80 ? "text-emerald-500" : "text-slate-400")} />}
            note={t("harnessCoverageNote")}
          />
          <MetricCard
            label={t("bundleStatus")}
            value={bundleOutOfDate ? t("bundleStatusNeedsRefresh") : t("bundleStatusSynced")}
            icon={<Route className={cx("h-5 w-5", bundleOutOfDate ? "text-amber-500" : "text-emerald-500")} />}
            note={t("bundleStatusNote")}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">{t("inputReviewTitle")}</h2>
                  <p className="text-sm text-slate-500 mt-1">{t("inputReviewDesc")}</p>
                </div>

                <div className="space-y-5">
                  <Field
                    label={t("projectNameLabel")}
                    value={input.projectName}
                    onChange={(v) => updateInput("projectName", v)}
                    placeholder={t("projectNamePlaceholder")}
                  />
                  <Area
                    label={t("problemStatementLabel")}
                    value={input.problem}
                    onChange={(v) => updateInput("problem", v)}
                    placeholder={t("problemStatementPlaceholder")}
                    rows={5}
                  />
                  <Area
                    label={t("desiredOutcomeLabel")}
                    value={input.desiredOutcome}
                    onChange={(v) => updateInput("desiredOutcome", v)}
                    placeholder={t("desiredOutcomePlaceholder")}
                    rows={4}
                  />
                  <Field
                    label={t("stakeholdersLabel")}
                    value={input.stakeholders}
                    onChange={(v) => updateInput("stakeholders", v)}
                    placeholder={t("stakeholdersPlaceholder")}
                  />
                  <Area
                    label={t("constraintsLabel")}
                    value={input.constraints}
                    onChange={(v) => updateInput("constraints", v)}
                    placeholder={t("constraintsPlaceholder")}
                    rows={4}
                  />
                  <Area
                    label={t("notesLabel")}
                    value={input.notes}
                    onChange={(v) => updateInput("notes", v)}
                    placeholder={t("notesPlaceholder")}
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label={t("evidenceNeedLabel")}
                      value={input.evidenceNeed}
                      onChange={(v) => updateInput("evidenceNeed", v)}
                      options={[
                        { value: "low", label: t("levelLow") },
                        { value: "medium", label: t("levelMedium") },
                        { value: "high", label: t("levelHigh") },
                      ]}
                    />
                    <SelectField
                      label={t("riskLevelLabel")}
                      value={input.riskLevel}
                      onChange={(v) => updateInput("riskLevel", v)}
                      options={[
                        { value: "low", label: t("levelLow") },
                        { value: "medium", label: t("levelMedium") },
                        { value: "high", label: t("levelHigh") },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label={t("complexityLabel")}
                      value={input.complexity}
                      onChange={(v) => updateInput("complexity", v)}
                      options={[
                        { value: "single-step", label: t("compSingle") },
                        { value: "multi-step", label: t("compMultiStep") },
                        { value: "multi-actor", label: t("compMultiActor") },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{t("availableToolsLabel")}</label>
                    <div className="flex flex-wrap gap-2">
                      {toolOptions.map((tool) => (
                        <TogglePill
                          key={tool}
                          active={input.availableTools.includes(tool)}
                          onClick={() => {
                            const next = input.availableTools.includes(tool)
                              ? input.availableTools.filter((t) => t !== tool)
                              : [...input.availableTools, tool];
                            updateInput("availableTools", next);
                          }}
                        >
                          {t(`tool${tool.charAt(0).toUpperCase() + tool.slice(1)}`)}
                        </TogglePill>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Lock className="h-4 w-4" />
                  {t("executionBlockersTitle")}
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
                      {t("readyForExecution")}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {t("blockersNote")}
                </p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "routine", label: t("tabRoutine") },
                  { id: "harness", label: t("tabHarness") },
                  { id: "artifact", label: t("tabArtifact") },
                  { id: "runbook", label: t("tabRunbook") },
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
                          {t("recommendedNow")}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {recommendation.skillIds.map((id) => {
                            const skill = getPatternById(skillPatterns, id);
                            return (
                              <span key={id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                                {skill.label[language] || skill.label["en"]}
                              </span>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {recommendation.harnessIds.map((id) => {
                            const harness = getPatternById(harnessPatterns, id);
                            return (
                              <span key={id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                                {harness.label[language] || harness.label["en"]}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {skillPatterns.map((pattern, index) => (
                          <PatternCard
                            key={pattern.id}
                            title={`${index + 1}. ${pattern.label[language] || pattern.label["en"]}`}
                            subtitle={pattern.label["en"]}
                            desc={`${pattern.desc[language] || pattern.desc["en"]} Output: ${pattern.output.join(", ")}`}
                            selected={selectedSkillIds.includes(pattern.id)}
                            recommended={recommendation.skillIds.includes(pattern.id)}
                            recommendedLabel={t("recommendedForInput")}
                            onToggle={() => toggleSkill(pattern.id)}
                            badge={pattern.core ? t("badgeCore") : t("badgeOptional")}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "harness" ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <label className="block">
                          <div className="mb-2 text-sm font-medium text-slate-700">{t("patternSearchLabel")}</div>
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              value={patternQuery}
                              onChange={(e) => setPatternQuery(e.target.value)}
                              placeholder={t("patternSearchPlaceholder")}
                              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
                            />
                          </div>
                        </label>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          {t("architectureLabel")}: <span className="font-semibold text-slate-900">{architectureLabel}</span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 text-sm font-semibold text-slate-900">{t("skillLayer")}</div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          {filteredSkills.map((pattern) => (
                            <PatternCard
                              key={pattern.id}
                              title={pattern.label[language] || pattern.label["en"]}
                              subtitle={pattern.label["en"]}
                              desc={pattern.desc[language] || pattern.desc["en"]}
                              selected={selectedSkillIds.includes(pattern.id)}
                              recommended={recommendation.skillIds.includes(pattern.id)}
                              recommendedLabel={t("recommendedForInput")}
                              onToggle={() => toggleSkill(pattern.id)}
                              badge={pattern.core ? t("badgeCore") : t("badgeOptional")}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-3 text-sm font-semibold text-slate-900">{t("harnessLayer")}</div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          {filteredHarness.map((pattern) => (
                            <PatternCard
                              key={pattern.id}
                              title={pattern.label[language] || pattern.label["en"]}
                              subtitle={t(`group${pattern.group}`)}
                              desc={pattern.desc[language] || pattern.desc["en"]}
                              selected={selectedHarnessIds.includes(pattern.id)}
                              recommended={recommendation.harnessIds.includes(pattern.id)}
                              recommendedLabel={t("recommendedForInput")}
                              onToggle={() => toggleHarness(pattern.id)}
                              badge={t(`group${pattern.group}`)}
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
                            <div className="text-xs text-slate-500">{t("artifactNote")}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => downloadTextFile("artifact_bundle.md", markdownBundle)}
                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                            >
                              <FileText className="h-4 w-4" />
                              {t("downloadMarkdown")}
                            </button>
                            <button
                              onClick={() => downloadTextFile("artifact_bundle.json", bundleString)}
                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                            >
                              <Download className="h-4 w-4" />
                              {t("downloadJSON")}
                            </button>
                            <button
                              onClick={regenerateArtifacts}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                            >
                              {t("regenerateThisBundle")}
                            </button>
                          </div>
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
                          {t("executionArchitecture")}
                        </div>
                        <div className="mt-3 text-lg font-semibold text-slate-900">{architectureLabel}</div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {t("executionArchitectureNote")}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Route className="h-4 w-4" />
                            {t("runtimeLoop")}
                          </div>
                          <div className="mt-4 space-y-3">
                            {selectedSkills.map((skill, index) => (
                              <div key={skill.id} className="rounded-2xl border border-slate-200 p-3">
                                <div className="text-sm font-semibold text-slate-900">
                                  {index + 1}. {skill.label[language] || skill.label["en"]}
                                </div>
                                <div className="mt-1 text-sm text-slate-600">{skill.done[language] || skill.done["en"]}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Database className="h-4 w-4" />
                            {t("selectedHarnessStack")}
                          </div>
                          <div className="mt-4 space-y-3">
                            {selectedHarness.map((item) => (
                              <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                                <div className="mt-1 text-sm font-semibold text-slate-900">{item.label[language] || item.label["en"]}</div>
                                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                                  {t(`group${item.group}`)}
                                </div>
                                <div className="mt-2 text-sm text-slate-600">{item.desc[language] || item.desc["en"]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">{t("executionReadyCombination")}</div>
                        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("coreArtifacts")}</div>
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
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("recommendedNextAction")}</div>
                            <div className="mt-3 text-sm leading-6 text-slate-700">
                              {bundleOutOfDate
                                ? t("nextActionNeedsRefresh")
                                : t("nextActionSynced")}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("governance")}</div>
                            <div className="mt-3 text-sm leading-6 text-slate-700">
                              {selectedHarnessIds.includes("human-gate")
                                ? t("humanGateEnabled")
                                : t("humanGateDisabled")}
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
      <LanguageSwitcher current={language} onSelect={handleLanguageChange} />
    </div>
  );
}
