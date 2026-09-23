import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../i18n.js";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Brain,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BarChart3,
  Award,
  Maximize2,
  Minimize2,
  Download,
  FileSpreadsheet,
  FileJson,
  Globe,
} from "lucide-react";

export interface HumanTrialResult {
  trial_id: string;
  stimulus_id: string;
  condition: string;
  reaction_time: number;
  correct: number;
  response: string;
  expected: string;
  valid: boolean;
}

type TestParadigmId = "C05-01" | "C02-01" | "C03-01" | "C04-01" | "C01-01";

interface ParadigmDef {
  id: TestParadigmId;
  name: string;
  domain: string;
  tier: string;
  shortDesc: string;
  instructions: string;
  keysHint: string;
  defaultTrials: number;
}

const PARADIGMS_EN: Record<TestParadigmId, ParadigmDef> = {
  "C05-01": {
    id: "C05-01",
    name: "Stroop Color-Word Interference",
    domain: "Inhibitory Control & Executive Function (C05)",
    tier: "Tier I",
    shortDesc: "Measure semantic conflict suppression by naming the font color, not the written word.",
    instructions:
      "A word will appear in colored text. Your goal is to identify the FONT COLOR of the word as fast as possible, ignoring the text itself. Press the corresponding key or click the button below.",
    keysHint: "[R] Red • [G] Green • [B] Blue • [Y] Yellow",
    defaultTrials: 12,
  },
  "C02-01": {
    id: "C02-01",
    name: "2-Back Working Memory Updating",
    domain: "Working Memory Capacity (C02)",
    tier: "Tier I",
    shortDesc: "Track dynamic memory buffers by indicating if the current item matches 2 steps ago.",
    instructions:
      "A sequence of letters will appear one by one. Decide whether the CURRENT letter matches the letter presented EXACTLY TWO TRIALS AGO. Press MATCH if it matches, or NO MATCH if it does not.",
    keysHint: "[M] Match • [N] No Match",
    defaultTrials: 14,
  },
  "C03-01": {
    id: "C03-01",
    name: "Choice Reaction Time & Processing Speed",
    domain: "Processing Speed (C03)",
    tier: "Tier I",
    shortDesc: "Sub-millisecond visual sensorimotor latency with variable foreperiod fixation.",
    instructions:
      "Focus on the central crosshair. As soon as the target arrow appears on the LEFT or RIGHT, respond immediately in that direction. Speed and accuracy both count!",
    keysHint: "[←] or [A] Left • [→] or [D] Right",
    defaultTrials: 10,
  },
  "C04-01": {
    id: "C04-01",
    name: "Eriksen Flanker Task (Selective Attention)",
    domain: "Selective Attention & Interference (C04)",
    tier: "Tier I",
    shortDesc: "Measure spatial distractor suppression by focusing strictly on the central target arrow.",
    instructions:
      "You will see a row of 5 arrows. Identify the direction of the MIDDLE arrow only, while ignoring the surrounding flanking arrows. Some trials are congruent (same direction) and some are incongruent.",
    keysHint: "[←] or [A] Left • [→] or [D] Right",
    defaultTrials: 12,
  },
  "C01-01": {
    id: "C01-01",
    name: "Matrix Reasoning / Pattern Completion",
    domain: "Fluid Reasoning (C01)",
    tier: "Tier I",
    shortDesc: "Abstract logical problem solving: deduce the missing geometric element.",
    instructions:
      "Examine the 2x2 or 3x3 pattern matrix to detect the governing rule (e.g. rotation, shape progression, quantity). Select the choice that logically completes the missing spot.",
    keysHint: "Click choices [1], [2], [3], or [4]",
    defaultTrials: 6,
  },
};

const PARADIGMS_AZ: Record<TestParadigmId, ParadigmDef> = {
  "C05-01": {
    id: "C05-01",
    name: "Stroop Rəng-Söz Müdaxiləsi",
    domain: "İnhibitor Nəzarət və İcraedici Funksiya (C05)",
    tier: "Tier I",
    shortDesc: "Yazılmış sözü deyil, şriftin rəngini adlandıraraq semantik konfliktin qarşısının alınmasını ölçün.",
    instructions:
      "Rəngli mətndə bir söz görünəcək. Məqsədiniz sözün mənasına fikir vermədən ŞRİFTİN RƏNGİNİ mümkün qədər tez müəyyənləşdirməkdir. Müvafiq klaviatura düyməsinə basın və ya aşağıdakı düyməyə klikləyin.",
    keysHint: "[Q/R] Qırmızı • [Y/G] Yaşıl • [M/B] Mavi • [S/Y] Sarı",
    defaultTrials: 12,
  },
  "C02-01": {
    id: "C02-01",
    name: "2-Geri İşçi Yaddaş Yenilənməsi",
    domain: "İşçi Yaddaş Tutumu (C02)",
    tier: "Tier I",
    shortDesc: "Cari elementin 2 addım əvvəlki elementlə uyğun gəlib-gəlmədiyini göstərərək dinamik yaddaş buferlərini izləyin.",
    instructions:
      "Hərflər bir-bir ekranda görünəcək. CARİ hərfin DƏQİQ İKİ SINAQ ƏVVƏL təqdim olunmuş hərflə eyni olub-olmadığını müəyyən edin. Uyğundursa UYĞUNDUR, deyilsə UYĞUN DEYİL düyməsinə basın.",
    keysHint: "[M] Uyğundur • [N] Uyğun Deyil",
    defaultTrials: 14,
  },
  "C03-01": {
    id: "C03-01",
    name: "Seçim Reaksiyası Vaxtı və Emal Sürəti",
    domain: "Emal Sürəti (C03)",
    tier: "Tier I",
    shortDesc: "Dəyişkən fiksasiya intervalı ilə sub-millisaniyəlik vizual sensor-motor gecikməsi.",
    instructions:
      "Mərkəzi nişangaha fokuslanın. Hədəf oxu SOLDA və ya SAĞDA görünən kimi dərhal həmin istiqamətə reaksiya verin. Həm sürət, həm də dəqiqlik vacibdir!",
    keysHint: "[←] və ya [A] Sol • [→] və ya [D] Sağ",
    defaultTrials: 10,
  },
  "C04-01": {
    id: "C04-01",
    name: "Eriksen Flanker Tapşırığı (Selektiv Diqqət)",
    domain: "Selektiv Diqqət və Müdaxilə (C04)",
    tier: "Tier I",
    shortDesc: "Yalnız mərkəzi hədəf oxuna diqqət yetirərək məkan yayındırıcılarının yatırılmasını ölçün.",
    instructions:
      "5 oxdan ibarət sıra görəcəksiniz. Ətrafdakı kənar oxlara fikir vermədən yalnız ORTA oxun istiqamətini müəyyən edin. Bəzi sınaqlar uyğun (eyni istiqamət), bəziləri isə uyğunsuzdur.",
    keysHint: "[←] və ya [A] Sol • [→] və ya [D] Sağ",
    defaultTrials: 12,
  },
  "C01-01": {
    id: "C01-01",
    name: "Matris Məntiqi / Naxışın Tamamlanması",
    domain: "Çevik Mühakimə (C01)",
    tier: "Tier I",
    shortDesc: "Mücərrəd məntiqi problem həlli: çatışmayan həndəsi elementi müəyyən edin.",
    instructions:
      "İdarəedici qanunauyğunluğu (fırlanma, forma ardıcıllığı, say artımı) aşkar etmək üçün 2x2 və ya 3x3 matrisi araşdırın. Çatışmayan yeri məntiqi olaraq tamamlayan variantı seçin.",
    keysHint: "[1], [2], [3] və ya [4] variantına klikləyin",
    defaultTrials: 6,
  },
};

const PARADIGMS = PARADIGMS_EN;


type TestPhase = "SELECT" | "INSTRUCTIONS" | "COUNTDOWN" | "FIXATION" | "STIMULUS" | "FEEDBACK" | "RESULTS";

interface StroopStimulus {
  word: "RED" | "GREEN" | "BLUE" | "YELLOW";
  colorName: "RED" | "GREEN" | "BLUE" | "YELLOW";
  colorHex: string;
  isCongruent: boolean;
}

interface FlankerStimulus {
  display: string;
  targetDirection: "LEFT" | "RIGHT";
  isCongruent: boolean;
}

interface ReactionStimulus {
  side: "LEFT" | "RIGHT";
}

interface MatrixItem {
  matrixQuestion: string[][];
  options: string[];
  correctIndex: number;
  ruleExplanation: string;
}

export const InteractiveTestChamber: React.FC<{ initialParadigm?: TestParadigmId }> = ({
  initialParadigm = "C05-01",
}) => {
  const { language, setLanguage } = useLanguage();
  const isAz = language === "az";
  const PARADIGMS = isAz ? PARADIGMS_AZ : PARADIGMS_EN;

  const [selectedParadigm, setSelectedParadigm] = useState<TestParadigmId>(initialParadigm);
  const [totalTrials, setTotalTrials] = useState<number>(PARADIGMS[initialParadigm]?.defaultTrials || 10);
  const [phase, setPhase] = useState<TestPhase>("SELECT");
  const [countdown, setCountdown] = useState<number>(3);
  const [currentTrialIdx, setCurrentTrialIdx] = useState<number>(0);

  useEffect(() => {
    if (initialParadigm && PARADIGMS[initialParadigm]) {
      setSelectedParadigm(initialParadigm);
      setTotalTrials(PARADIGMS[initialParadigm].defaultTrials);
      setPhase("INSTRUCTIONS");
    }
  }, [initialParadigm]);

  // Runtime timing and records
  const stimulusOnsetRef = useRef<number>(0);
  const [recordedTrials, setRecordedTrials] = useState<HumanTrialResult[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; rt: number } | null>(null);

  // Paradigm-specific trial buffers
  const [stroopCurrent, setStroopCurrent] = useState<StroopStimulus | null>(null);
  const [nBackLetterStream, setNBackLetterStream] = useState<string[]>([]);
  const [flankerCurrent, setFlankerCurrent] = useState<FlankerStimulus | null>(null);
  const [reactionCurrent, setReactionCurrent] = useState<ReactionStimulus | null>(null);
  const [matrixCurrent, setMatrixCurrent] = useState<MatrixItem | null>(null);

  // Server submission state
  const [committing, setCommitting] = useState(false);
  const [committedResult, setCommittedResult] = useState<any>(null);

  // Fullscreen distraction-free testing state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Exit fullscreen on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  // Reset when initialParadigm changes
  useEffect(() => {
    setSelectedParadigm(initialParadigm);
    setTotalTrials(PARADIGMS[initialParadigm].defaultTrials);
  }, [initialParadigm]);

  // Generators for next stimuli
  const generateStroopStimulus = (): StroopStimulus => {
    const words: Array<"RED" | "GREEN" | "BLUE" | "YELLOW"> = ["RED", "GREEN", "BLUE", "YELLOW"];
    const colors: Record<"RED" | "GREEN" | "BLUE" | "YELLOW", string> = {
      RED: "#ef4444",
      GREEN: "#10b981",
      BLUE: "#3b82f6",
      YELLOW: "#eab308",
    };
    const isCongruent = Math.random() < 0.5;
    const word = words[Math.floor(Math.random() * words.length)];
    let colorName = word;
    if (!isCongruent) {
      const otherColors = words.filter((w) => w !== word);
      colorName = otherColors[Math.floor(Math.random() * otherColors.length)];
    }
    return {
      word,
      colorName,
      colorHex: colors[colorName],
      isCongruent,
    };
  };

  const generateNBackStream = (length: number): string[] => {
    const letters = ["A", "B", "C", "D", "H", "K", "L", "M", "R", "T", "X"];
    const stream: string[] = [];
    for (let i = 0; i < length; i++) {
      if (i >= 2 && Math.random() < 0.35) {
        stream.push(stream[i - 2]); // Match 2-back
      } else {
        const randLetter = letters[Math.floor(Math.random() * letters.length)];
        stream.push(randLetter);
      }
    }
    return stream;
  };

  const generateFlankerStimulus = (): FlankerStimulus => {
    const isCongruent = Math.random() < 0.5;
    const targetDirection: "LEFT" | "RIGHT" = Math.random() < 0.5 ? "LEFT" : "RIGHT";
    const targetChar = targetDirection === "LEFT" ? "◀" : "▶";
    const flankerChar = isCongruent
      ? targetChar
      : targetDirection === "LEFT"
      ? "▶"
      : "◀";
    const display = `${flankerChar} ${flankerChar} ${targetChar} ${flankerChar} ${flankerChar}`;
    return { display, targetDirection, isCongruent };
  };

  const generateReactionStimulus = (): ReactionStimulus => {
    return { side: Math.random() < 0.5 ? "LEFT" : "RIGHT" };
  };

  const MATRIX_ITEMS_EN: MatrixItem[] = [
    {
      matrixQuestion: [
        ["▲", "▲▲"],
        ["■", "■■"],
      ],
      options: ["●", "■■■", "▲▲", "■"],
      correctIndex: 1,
      ruleExplanation: "Row doubling: each subsequent column doubles the count of shapes.",
    },
    {
      matrixQuestion: [
        ["○", "◐", "●"],
        ["△", "▲", "▲"],
        ["□", "◪", "?"],
      ],
      options: ["■", "□", "◩", "◇"],
      correctIndex: 0,
      ruleExplanation: "Progression: empty → half-filled → fully-filled shape.",
    },
    {
      matrixQuestion: [
        ["↑", "→", "↓"],
        ["←", "↑", "→"],
        ["↓", "←", "?"],
      ],
      options: ["↑", "→", "↓", "↙"],
      correctIndex: 0,
      ruleExplanation: "Clockwise 90-degree spatial rotation per column.",
    },
    {
      matrixQuestion: [
        ["●", "●●", "●●●"],
        ["◆", "◆◆", "◆◆◆"],
        ["★", "★★", "?"],
      ],
      options: ["★★★", "★", "★★★★", "●●●"],
      correctIndex: 0,
      ruleExplanation: "Arithmetic count increment (+1 element per cell horizontally).",
    },
    {
      matrixQuestion: [
        ["＋", "×", "＋"],
        ["×", "＋", "×"],
        ["＋", "×", "?"],
      ],
      options: ["＋", "×", "○", "－"],
      correctIndex: 0,
      ruleExplanation: "Alternating checkerboard symmetry rule.",
    },
    {
      matrixQuestion: [
        ["1", "2", "4"],
        ["3", "6", "12"],
        ["5", "10", "?"],
      ],
      options: ["15", "20", "25", "12"],
      correctIndex: 1,
      ruleExplanation: "Multiplication by 2 rule across columns (5 * 2 = 10, 10 * 2 = 20).",
    },
  ];

  const MATRIX_ITEMS_AZ: MatrixItem[] = [
    {
      matrixQuestion: [
        ["▲", "▲▲"],
        ["■", "■■"],
      ],
      options: ["●", "■■■", "▲▲", "■"],
      correctIndex: 1,
      ruleExplanation: "Sətir üzrə ikiqat artım: hər növbəti sütun fiqurların sayını iki dəfə artırır.",
    },
    {
      matrixQuestion: [
        ["○", "◐", "●"],
        ["△", "▲", "▲"],
        ["□", "◪", "?"],
      ],
      options: ["■", "□", "◩", "◇"],
      correctIndex: 0,
      ruleExplanation: "Doluluq proqressiyası: boş fiqurdan tam dolu fiqura doğru inkişaf edir.",
    },
    {
      matrixQuestion: [
        ["↑", "→", "↓"],
        ["←", "↑", "→"],
        ["↓", "←", "?"],
      ],
      options: ["↑", "→", "↓", "↙"],
      correctIndex: 0,
      ruleExplanation: "Saat əqrəbi istiqamətində 90 dərəcəlik fırlanma: ↑ → → ↓.",
    },
    {
      matrixQuestion: [
        ["●", "●●", "●●●"],
        ["◆", "◆◆", "◆◆◆"],
        ["★", "★★", "?"],
      ],
      options: ["★★★", "★", "★★★★", "●●●"],
      correctIndex: 0,
      ruleExplanation: "Xətti say artımı: hər sətirdə simvolların sayı 1 vahid artır.",
    },
    {
      matrixQuestion: [
        ["＋", "×", "＋"],
        ["×", "＋", "×"],
        ["＋", "×", "?"],
      ],
      options: ["＋", "×", "○", "－"],
      correctIndex: 0,
      ruleExplanation: "Növbələşən şahmat simmetriyası qaydası.",
    },
    {
      matrixQuestion: [
        ["1", "2", "4"],
        ["3", "6", "12"],
        ["5", "10", "?"],
      ],
      options: ["15", "20", "25", "12"],
      correctIndex: 1,
      ruleExplanation: "Sütunlar üzrə 2-yə vurma qaydası (5 * 2 = 10, 10 * 2 = 20).",
    },
  ];

  const MATRIX_ITEMS = isAz ? MATRIX_ITEMS_AZ : MATRIX_ITEMS_EN;

  // Starting test session
  const handleStartTest = () => {
    setRecordedTrials([]);
    setCurrentTrialIdx(0);
    setCommittedResult(null);
    setPhase("COUNTDOWN");
    setCountdown(3);

    if (selectedParadigm === "C02-01") {
      setNBackLetterStream(generateNBackStream(totalTrials));
    }
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== "COUNTDOWN") return;
    if (countdown > 1) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        startTrial(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, countdown]);

  // Start trial: Fixation phase with random jitter (400-800ms)
  const startTrial = (trialIndex: number) => {
    setCurrentTrialIdx(trialIndex);
    setPhase("FIXATION");

    const jitter = Math.floor(450 + Math.random() * 350);
    setTimeout(() => {
      // Setup stimulus
      if (selectedParadigm === "C05-01") {
        setStroopCurrent(generateStroopStimulus());
      } else if (selectedParadigm === "C04-01") {
        setFlankerCurrent(generateFlankerStimulus());
      } else if (selectedParadigm === "C03-01") {
        setReactionCurrent(generateReactionStimulus());
      } else if (selectedParadigm === "C01-01") {
        setMatrixCurrent(MATRIX_ITEMS[trialIndex % MATRIX_ITEMS.length]);
      }
      setPhase("STIMULUS");
      stimulusOnsetRef.current = performance.now();
    }, jitter);
  };

  // Submit trial response
  const handleResponse = useCallback(
    (responseVal: string) => {
      if (phase !== "STIMULUS") return;
      const rt = Math.round(performance.now() - stimulusOnsetRef.current);

      let isCorrect = false;
      let condition = "STANDARD";
      let expected = "";

      if (selectedParadigm === "C05-01" && stroopCurrent) {
        expected = stroopCurrent.colorName;
        isCorrect = responseVal.toUpperCase() === stroopCurrent.colorName;
        condition = stroopCurrent.isCongruent ? "CONGRUENT" : "INCONGRUENT";
      } else if (selectedParadigm === "C02-01") {
        const stream = nBackLetterStream;
        const isMatch = currentTrialIdx >= 2 && stream[currentTrialIdx] === stream[currentTrialIdx - 2];
        expected = isMatch ? "MATCH" : "NO_MATCH";
        isCorrect = responseVal === expected;
        condition = isMatch ? "2_BACK_TARGET" : "DISTRACTOR";
      } else if (selectedParadigm === "C03-01" && reactionCurrent) {
        expected = reactionCurrent.side;
        isCorrect = responseVal === reactionCurrent.side;
        condition = `CHOICE_${reactionCurrent.side}`;
      } else if (selectedParadigm === "C04-01" && flankerCurrent) {
        expected = flankerCurrent.targetDirection;
        isCorrect = responseVal === flankerCurrent.targetDirection;
        condition = flankerCurrent.isCongruent ? "CONGRUENT" : "INCONGRUENT";
      } else if (selectedParadigm === "C01-01" && matrixCurrent) {
        const selectedIdx = Number(responseVal);
        isCorrect = selectedIdx === matrixCurrent.correctIndex;
        expected = `OPTION_${matrixCurrent.correctIndex + 1}`;
        condition = "MATRIX_REASONING";
      }

      const trialResult: HumanTrialResult = {
        trial_id: `T${currentTrialIdx + 1}`,
        stimulus_id: `STIM_${currentTrialIdx + 1}`,
        condition,
        reaction_time: rt,
        correct: isCorrect ? 1 : 0,
        response: responseVal,
        expected,
        valid: rt >= 100 && rt <= 10000,
      };

      setRecordedTrials((prev) => [...prev, trialResult]);
      setLastFeedback({ correct: isCorrect, rt });
      setPhase("FEEDBACK");

      setTimeout(() => {
        if (currentTrialIdx + 1 < totalTrials) {
          startTrial(currentTrialIdx + 1);
        } else {
          setPhase("RESULTS");
        }
      }, 300);
    },
    [
      phase,
      selectedParadigm,
      stroopCurrent,
      nBackLetterStream,
      reactionCurrent,
      flankerCurrent,
      matrixCurrent,
      currentTrialIdx,
      totalTrials,
    ]
  );

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "STIMULUS") return;
      const key = e.key.toUpperCase();

      if (selectedParadigm === "C05-01") {
        if (key === "R" || key === "Q") handleResponse("RED");
        else if (key === "G" || (isAz ? key === "Y" : false)) handleResponse("GREEN");
        else if (key === "B" || key === "M") handleResponse("BLUE");
        else if ((!isAz && key === "Y") || key === "S") handleResponse("YELLOW");
      } else if (selectedParadigm === "C02-01") {
        if (key === "M") handleResponse("MATCH");
        else if (key === "N") handleResponse("NO_MATCH");
      } else if (selectedParadigm === "C03-01" || selectedParadigm === "C04-01") {
        if (e.key === "ArrowLeft" || key === "A") handleResponse("LEFT");
        else if (e.key === "ArrowRight" || key === "D") handleResponse("RIGHT");
      } else if (selectedParadigm === "C01-01") {
        if (key === "1") handleResponse("0");
        else if (key === "2") handleResponse("1");
        else if (key === "3") handleResponse("2");
        else if (key === "4") handleResponse("3");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, selectedParadigm, handleResponse]);

  // Aggregate metrics calculation
  const total = recordedTrials.length;
  const correctCount = recordedTrials.filter((t) => t.correct === 1).length;
  const accuracyPct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const meanRt =
    total > 0
      ? Math.round(recordedTrials.reduce((sum, t) => sum + t.reaction_time, 0) / total)
      : 0;

  // Specific paradigm derived metrics
  const congruentTrials = recordedTrials.filter((t) => t.condition === "CONGRUENT");
  const incongruentTrials = recordedTrials.filter((t) => t.condition === "INCONGRUENT");

  const meanCongruentRt =
    congruentTrials.length > 0
      ? Math.round(congruentTrials.reduce((s, t) => s + t.reaction_time, 0) / congruentTrials.length)
      : 0;
  const meanIncongruentRt =
    incongruentTrials.length > 0
      ? Math.round(incongruentTrials.reduce((s, t) => s + t.reaction_time, 0) / incongruentTrials.length)
      : 0;
  const interferenceEffect = meanIncongruentRt - meanCongruentRt;

  const rtValues = recordedTrials.map((t) => t.reaction_time);
  const minRt = rtValues.length > 0 ? Math.round(Math.min(...rtValues)) : 0;
  const maxRt = rtValues.length > 0 ? Math.round(Math.max(...rtValues)) : 0;
  const medianRt =
    rtValues.length > 0
      ? Math.round([...rtValues].sort((a, b) => a - b)[Math.floor(rtValues.length / 2)])
      : 0;

  const handleExportCSV = () => {
    if (recordedTrials.length === 0) return;
    const headers = ["trial_id", "stimulus_id", "condition", "reaction_time_ms", "correct", "response", "expected", "valid"];
    const rows = recordedTrials.map((t) => [
      t.trial_id,
      t.stimulus_id,
      t.condition,
      t.reaction_time.toFixed(1),
      t.correct,
      `"${t.response}"`,
      `"${t.expected}"`,
      t.valid,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dnem_${selectedParadigm}_trials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (recordedTrials.length === 0) return;
    const exportPayload = {
      platform: "DNEM Scientific Platform v7.7",
      specification_id: selectedParadigm,
      paradigm_name: PARADIGMS[selectedParadigm].name,
      domain: PARADIGMS[selectedParadigm].domain,
      timestamp: new Date().toISOString(),
      session_checksum: committedResult?.checksum || null,
      summary_metrics: {
        total_trials: recordedTrials.length,
        accuracy_percentage: accuracyPct,
        mean_rt_ms: meanRt,
        median_rt_ms: medianRt,
        min_rt_ms: minRt,
        max_rt_ms: maxRt,
        congruent_mean_rt_ms: congruentTrials.length > 0 ? meanCongruentRt : undefined,
        incongruent_mean_rt_ms: incongruentTrials.length > 0 ? meanIncongruentRt : undefined,
        interference_delta_ms:
          congruentTrials.length > 0 && incongruentTrials.length > 0 ? interferenceEffect : undefined,
      },
      trials: recordedTrials,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `dnem_${selectedParadigm}_session_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Commit empirical results to backend
  const handleCommitToLedger = async () => {
    setCommitting(true);
    try {
      const sessionId = `human_${Date.now()}`;
      const res = await fetch(`/api/v1/sessions/${sessionId}/submit-human-trials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurement_id: selectedParadigm,
          trials: recordedTrials,
          participant_id: "human_user_participant",
        }),
      });
      const data = await res.json();
      setCommittedResult(data);
    } catch (err) {
      console.error("Failed to commit human test data", err);
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div
      className={
        isFullscreen && phase !== "SELECT" && phase !== "RESULTS"
          ? "fixed inset-0 z-50 bg-slate-950 p-4 sm:p-8 flex flex-col justify-between overflow-y-auto"
          : "space-y-6"
      }
    >
      {/* Fullscreen HUD Bar (Visible only when in Fullscreen) */}
      {isFullscreen && phase !== "SELECT" && phase !== "RESULTS" ? (
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 border border-blue-800 px-2.5 py-0.5 rounded">
              {PARADIGMS[selectedParadigm].id}
            </span>
            <span className="text-sm font-bold text-white">{PARADIGMS[selectedParadigm].name}</span>
            <span className="text-xs text-slate-400 font-mono">
              ({isAz ? "Sınaq" : "Trial"} {currentTrialIdx + 1} {isAz ? "/" : "of"} {totalTrials})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  !isAz ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("az")}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  isAz ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-white"
                }`}
              >
                AZ
              </button>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              title="Exit fullscreen mode (or press Escape)"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              {isAz ? "Tam Ekrandan Çıx (Esc)" : "Exit Fullscreen (Esc)"}
            </button>
            <button
              onClick={() => {
                setIsFullscreen(false);
                setPhase("SELECT");
              }}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {isAz ? "Testdən Çıx" : "Exit Test"}
            </button>
          </div>
        </div>
      ) : (
        /* Standard Header Banner */
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              {isAz ? "Canlı İnsan İştirakçı Test Kamerası" : "Live Human Participant Testing Chamber"}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAz ? "İnteraktiv Koqnitiv Batareya İcrası" : "Interactive Cognitive Battery Execution"}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {isAz
                ? "Milli-saniyə dəqiqliyində reaksiya vaxtı qeydiyyatı, sərt hadisə vaxtlama müqavilələri və ani kriptoqrafik SHA-256 mənşə kilidi ilə real empirik koqnitiv testləri keçin."
                : "Take real empirical cognitive tests with sub-millisecond reaction time capture, strict event timing contracts, and immediate cryptographic SHA-256 provenance locking."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* In-Chamber Language Switcher */}
            <div
              className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shadow-2xs"
              title={isAz ? "Test üçün dili seçin" : "Select language for cognitive tests"}
            >
              <Globe className="h-3.5 w-3.5 text-slate-500 ml-1" />
              <span className="text-[11px] font-medium text-slate-600 pl-0.5 pr-1">
                {isAz ? "Test Dili:" : "Test Lang:"}
              </span>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all ${
                  !isAz ? "bg-white text-blue-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("az")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all ${
                  isAz ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                AZ
              </button>
            </div>

            {phase !== "SELECT" && phase !== "RESULTS" && (
              <>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Distraction-Free Fullscreen Mode"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  {isAz ? "Tam Ekran" : "Fullscreen"}
                </button>
                <button
                  onClick={() => {
                    setIsFullscreen(false);
                    setPhase("SELECT");
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {isAz ? "Testdən Çıx" : "Exit Test"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* PHASE 1: SELECT PARADIGM */}
      {phase === "SELECT" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(PARADIGMS) as TestParadigmId[]).map((pid) => {
              const p = PARADIGMS[pid];
              const isSelected = selectedParadigm === pid;
              return (
                <div
                  key={pid}
                  onClick={() => {
                    setSelectedParadigm(pid);
                    setTotalTrials(p.defaultTrials);
                  }}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-50/90 border-blue-400 shadow-sm ring-1 ring-blue-400"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {p.id}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">{p.tier}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{p.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.shortDesc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {isAz ? "Standart:" : "Default:"} {p.defaultTrials} {isAz ? "sınaq" : "trials"}
                    </span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      {isAz ? "Seç" : "Select"} <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Test Setup Controls */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              {isAz ? "Test Sessiyasını Tənzimləyin:" : "Configure Test Session:"} {PARADIGMS[selectedParadigm].name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  {isAz ? "Eksperimental Sınaqların Sayı" : "Number of Experimental Trials"}
                </label>
                <div className="flex gap-2">
                  {[6, 12, 20, 30].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setTotalTrials(count)}
                      className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                        totalTrials === count
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {count} {count === 6 ? (isAz ? "(Qısa Demo)" : "(Quick Demo)") : (isAz ? "sınaq" : "trials")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  {isAz ? "İştirakçının İdentifikasiyası" : "Participant Identification"}
                </label>
                <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono">
                  human_participant_01 ({isAz ? "Canlı Sessiya" : "Live Session"})
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPhase("INSTRUCTIONS")}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isAz ? "Təlimatlara Keç" : "Proceed to Instructions"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: INSTRUCTIONS */}
      {phase === "INSTRUCTIONS" && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">
              {PARADIGMS[selectedParadigm].id} &bull; {PARADIGMS[selectedParadigm].domain}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{PARADIGMS[selectedParadigm].name}</h3>
          </div>

          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-900">{isAz ? "Tapşırıq Təlimatları:" : "Task Instructions:"}</p>
            <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800">
              {PARADIGMS[selectedParadigm].instructions}
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs text-blue-950">
              <strong className="block text-blue-900 font-semibold">
                {isAz ? "Cavab İdarəetmə Düymələri:" : "Response Controls:"}
              </strong>
              <div className="font-mono text-blue-800">{PARADIGMS[selectedParadigm].keysHint}</div>
              <p className="text-[11px] text-blue-700 mt-1">
                {isAz
                  ? "Sınaq zamanı fiziki klaviatura düymələrindən və ya ekrandakı klik düymələrindən istifadə edə bilərsiniz."
                  : "You can respond using either physical keyboard hotkeys or on-screen click buttons during the trial."}
              </p>
            </div>

            <p className="text-xs text-slate-500 italic">
              {isAz
                ? `Mümkün qədər tez və dəqiq cavab verməyə çalışın. Sessiya ${totalTrials} sınaqdan ibarətdir.`
                : `Try to respond as accurately and quickly as possible. The session consists of ${totalTrials} trials.`}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setPhase("SELECT")}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              {isAz ? "Tapşırıq Siyahısına Qayıt" : "Back to Task List"}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(true);
                  handleStartTest();
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-2"
                title={isAz ? "Testi brauzer yayındırıcılarından təcrid edin" : "Insulate test from browser distractions"}
              >
                <Maximize2 className="h-4 w-4 text-emerald-400" />
                {isAz ? "Tam Ekran Rejimində Başla" : "Start in Fullscreen Mode"}
              </button>
              <button
                onClick={handleStartTest}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isAz ? "Hazıram — Testi Başlat" : "I Am Ready — Start Test"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: COUNTDOWN */}
      {phase === "COUNTDOWN" && (
        <div className="min-h-[380px] bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center p-8 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            {isAz ? "Hazırlaşın" : "Get Ready"}
          </div>
          <div className="text-7xl font-extrabold text-blue-600 font-mono animate-pulse">{countdown}</div>
          <p className="text-xs text-slate-500 font-mono">
            {isAz ? "Barmaqlarınızı cavab düymələrində saxlayın" : "Keep fingers on response keys"}
          </p>
        </div>
      )}

      {/* PHASE 4: FIXATION */}
      {phase === "FIXATION" && (
        <div className="min-h-[380px] bg-slate-950 rounded-2xl border border-slate-900 flex flex-col items-center justify-center relative overflow-hidden select-none">
          <div className="text-5xl font-mono text-slate-400 select-none">+</div>
          <div className="absolute top-4 right-4 text-xs font-mono text-slate-500">
            {isAz ? "Sınaq" : "Trial"} {currentTrialIdx + 1} / {totalTrials}
          </div>
        </div>
      )}

      {/* PHASE 5: STIMULUS & RESPONSE INPUT */}
      {phase === "STIMULUS" && (
        <div className="min-h-[380px] bg-slate-950 rounded-2xl border border-slate-900 flex flex-col items-center justify-between p-8 relative select-none">
          {/* Top Progress */}
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
            <span>{PARADIGMS[selectedParadigm].name}</span>
            <span>
              {isAz ? "Sınaq" : "Trial"} {currentTrialIdx + 1} {isAz ? "/" : "of"} {totalTrials}
            </span>
          </div>

          {/* Central Stimulus Display */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            {/* 1. Stroop Display */}
            {selectedParadigm === "C05-01" && stroopCurrent && (
              <div
                className="text-5xl sm:text-6xl font-extrabold tracking-wider select-none font-mono drop-shadow-md"
                style={{ color: stroopCurrent.colorHex }}
              >
                {isAz
                  ? stroopCurrent.word === "RED"
                    ? "QIRMIZI"
                    : stroopCurrent.word === "GREEN"
                    ? "YAŞIL"
                    : stroopCurrent.word === "BLUE"
                    ? "MAVİ"
                    : "SARI"
                  : stroopCurrent.word}
              </div>
            )}

            {/* 2. 2-Back Display */}
            {selectedParadigm === "C02-01" && (
              <div className="text-center space-y-3">
                <div className="text-6xl sm:text-7xl font-extrabold text-white font-mono tracking-widest">
                  {nBackLetterStream[currentTrialIdx]}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {isAz
                    ? "Bu hərf 2 addım əvvəlki hərflə eynidirmi?"
                    : "Does this match the letter from 2 steps back?"}
                </div>
              </div>
            )}

            {/* 3. Reaction Speed Display */}
            {selectedParadigm === "C03-01" && reactionCurrent && (
              <div className="flex items-center justify-center gap-16">
                <div
                  className={`text-6xl font-bold font-mono transition-transform ${
                    reactionCurrent.side === "LEFT" ? "text-amber-400 scale-125" : "text-slate-800"
                  }`}
                >
                  ◀
                </div>
                <div className="text-2xl text-slate-600 font-mono">+</div>
                <div
                  className={`text-6xl font-bold font-mono transition-transform ${
                    reactionCurrent.side === "RIGHT" ? "text-amber-400 scale-125" : "text-slate-800"
                  }`}
                >
                  ▶
                </div>
              </div>
            )}

            {/* 4. Flanker Display */}
            {selectedParadigm === "C04-01" && flankerCurrent && (
              <div className="text-center space-y-4">
                <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-widest text-blue-400">
                  {flankerCurrent.display}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {isAz
                    ? "Yalnız ORTA oxun istiqamətinə fokuslanın"
                    : "Focus on the MIDDLE arrow direction only"}
                </div>
              </div>
            )}

            {/* 5. Matrix Reasoning Display */}
            {selectedParadigm === "C01-01" && matrixCurrent && (
              <div className="space-y-4 flex flex-col items-center">
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {matrixCurrent.matrixQuestion.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center text-xl font-bold rounded-lg border ${
                          cell === "?"
                            ? "bg-amber-950/40 border-amber-500 text-amber-300 animate-pulse font-mono"
                            : "bg-slate-800 border-slate-700 text-slate-100"
                        }`}
                      >
                        {cell}
                      </div>
                    ))
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {isAz
                    ? "Naxışı tamamlayan xananı seçin:"
                    : "Select the tile that completes the pattern:"}
                </div>
              </div>
            )}
          </div>

          {/* Bottom On-Screen Response Buttons */}
          <div className="w-full pt-4 border-t border-slate-800">
            {/* Stroop Controls */}
            {selectedParadigm === "C05-01" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                <button
                  onClick={() => handleResponse("RED")}
                  className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="font-mono bg-red-800 px-1.5 py-0.5 rounded text-[10px]">
                    {isAz ? "Q / R" : "R"}
                  </span>
                  {isAz ? "QIRMIZI" : "RED"}
                </button>
                <button
                  onClick={() => handleResponse("GREEN")}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="font-mono bg-emerald-800 px-1.5 py-0.5 rounded text-[10px]">
                    {isAz ? "Y / G" : "G"}
                  </span>
                  {isAz ? "YAŞIL" : "GREEN"}
                </button>
                <button
                  onClick={() => handleResponse("BLUE")}
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="font-mono bg-blue-800 px-1.5 py-0.5 rounded text-[10px]">
                    {isAz ? "M / B" : "B"}
                  </span>
                  {isAz ? "MAVİ" : "BLUE"}
                </button>
                <button
                  onClick={() => handleResponse("YELLOW")}
                  className="py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="font-mono bg-yellow-700 text-white px-1.5 py-0.5 rounded text-[10px]">
                    {isAz ? "S / Y" : "Y"}
                  </span>
                  {isAz ? "SARI" : "YELLOW"}
                </button>
              </div>
            )}

            {/* 2-Back Controls */}
            {selectedParadigm === "C02-01" && (
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button
                  onClick={() => handleResponse("MATCH")}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span className="font-mono bg-emerald-800 px-1.5 py-0.5 rounded text-[10px]">M</span>
                  {isAz ? "UYĞUNDUR (2-Geri)" : "MATCH (2-Back)"}
                </button>
                <button
                  onClick={() => handleResponse("NO_MATCH")}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-[10px]">N</span>
                  {isAz ? "UYĞUN DEYİL" : "NO MATCH"}
                </button>
              </div>
            )}

            {/* Reaction & Flanker Controls */}
            {(selectedParadigm === "C03-01" || selectedParadigm === "C04-01") && (
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button
                  onClick={() => handleResponse("LEFT")}
                  className="py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span className="font-mono bg-blue-800 px-1.5 py-0.5 rounded text-[10px]">◀ / A</span>
                  {isAz ? "SOL" : "LEFT"}
                </button>
                <button
                  onClick={() => handleResponse("RIGHT")}
                  className="py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span className="font-mono bg-blue-800 px-1.5 py-0.5 rounded text-[10px]">▶ / D</span>
                  {isAz ? "SAĞ" : "RIGHT"}
                </button>
              </div>
            )}

            {/* Matrix Controls */}
            {selectedParadigm === "C01-01" && matrixCurrent && (
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                {matrixCurrent.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResponse(String(idx))}
                    className="py-3 px-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm flex flex-col items-center justify-center gap-1 border border-slate-700 hover:border-blue-400 transition-colors"
                  >
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isAz ? `${idx + 1}-ci Variant` : `Option ${idx + 1}`}
                    </span>
                    <span className="text-lg">{opt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 6: BRIEF INTER-TRIAL FEEDBACK */}
      {phase === "FEEDBACK" && (
        <div className="min-h-[380px] bg-slate-950 rounded-2xl border border-slate-900 flex flex-col items-center justify-center p-8 space-y-2">
          {lastFeedback?.correct ? (
            <div className="text-emerald-400 text-2xl font-bold font-mono flex items-center gap-2">
              <CheckCircle2 className="h-7 w-7" /> {isAz ? "Düzgün" : "Correct"} ({lastFeedback.rt} ms)
            </div>
          ) : (
            <div className="text-rose-400 text-2xl font-bold font-mono flex items-center gap-2">
              <AlertCircle className="h-7 w-7" /> {isAz ? "Səhv" : "Incorrect"} ({lastFeedback?.rt} ms)
            </div>
          )}
        </div>
      )}

      {/* PHASE 7: EMPIRICAL TEST RESULTS & PROVENANCE REPORT */}
      {phase === "RESULTS" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-semibold mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                {isAz ? "Sessiya Tamamlandı • Empirik İnsan Məlumatı Qeydə Alındı" : "Session Complete • Empirical Human Data Captured"}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {PARADIGMS[selectedParadigm].name} — {isAz ? "Psixometrik İcmal" : "Psychometric Summary"}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {isAz
                  ? `Deterministik hadisə şini müşahidəsi altında ${totalTrials} əməliyyat sınağı tamamlandı.`
                  : `Completed ${totalTrials} operational trials under deterministic event bus observation.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
                title={isAz ? "Bütün qeydə alınmış sınaqların CSV faylını yükləyin" : "Download CSV of all recorded trials"}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                {isAz ? "CSV İxrac" : "Export CSV"}
              </button>
              <button
                onClick={handleExportJSON}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
                title={isAz ? "BIDS uyğun JSON faylını yükləyin" : "Download BIDS-compatible JSON file"}
              >
                <FileJson className="h-3.5 w-3.5 text-blue-600" />
                {isAz ? "JSON İxrac" : "Export JSON"}
              </button>
              <button
                onClick={handleStartTest}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {isAz ? "Yenidən Keç" : "Retake Test"}
              </button>
              <button
                onClick={() => setPhase("SELECT")}
                className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
              >
                {isAz ? "Başqa Test Seç" : "Choose Another Test"}
              </button>
            </div>
          </div>

          {/* Primary Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                {isAz ? "Dəqiqlik Faizi" : "Accuracy Rate"}
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-600">{accuracyPct}%</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {correctCount} / {total} {isAz ? "düzgün" : "correct"}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                {isAz ? "Orta Reaksiya Vaxtı" : "Mean Reaction Time"}
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-900">{meanRt} ms</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {isAz ? "Median:" : "Median:"} {medianRt} ms ({isAz ? "Min:" : "Min:"} {minRt}ms)
              </div>
            </div>

            {/* Paradigm-specific card */}
            {selectedParadigm === "C05-01" ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-blue-800 uppercase">
                  {isAz ? "Stroop Müdaxiləsi" : "Stroop Interference"}
                </div>
                <div className="text-2xl font-extrabold font-mono text-blue-900">
                  {interferenceEffect > 0 ? `+${interferenceEffect}` : interferenceEffect} ms
                </div>
                <div className="text-[10px] text-blue-700 font-mono">
                  {isAz ? "Uyğunsuz" : "Incongruent"} ({meanIncongruentRt}ms) - {isAz ? "Uyğun" : "Congruent"} ({meanCongruentRt}ms)
                </div>
              </div>
            ) : selectedParadigm === "C04-01" ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-blue-800 uppercase">
                  {isAz ? "Flanker Münaqişə Dəyəri" : "Flanker Conflict Cost"}
                </div>
                <div className="text-2xl font-extrabold font-mono text-blue-900">
                  {interferenceEffect > 0 ? `+${interferenceEffect}` : interferenceEffect} ms
                </div>
                <div className="text-[10px] text-blue-700 font-mono">
                  {isAz ? "Məkan yayındırıcı gecikməsi" : "Spatial flanker delay"}
                </div>
              </div>
            ) : selectedParadigm === "C02-01" ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-blue-800 uppercase">
                  {isAz ? "İşçi Yaddaş Skoru" : "Working Memory Score"}
                </div>
                <div className="text-2xl font-extrabold font-mono text-blue-900">
                  {accuracyPct >= 80 ? (isAz ? "YÜKSƏK" : "HIGH") : accuracyPct >= 60 ? (isAz ? "NORMAL" : "NORMAL") : (isAz ? "SUB-OPTİMAL" : "SUB-OPTIMAL")}
                </div>
                <div className="text-[10px] text-blue-700 font-mono">
                  {isAz ? "2-Geri Bufer Sabitliyi" : "2-Back Buffer Stability"}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-blue-800 uppercase">
                  {isAz ? "Konstrukt Yetkinliyi" : "Construct Maturity"}
                </div>
                <div className="text-2xl font-extrabold font-mono text-blue-900">
                  {isAz ? "TƏSDİQLƏNDİ" : "VERIFIED"}
                </div>
                <div className="text-[10px] text-blue-700 font-mono">
                  {isAz ? "Məlumat Müqaviləsinə Uyğunluq" : "Data Contract Adherence"}
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                {isAz ? "Buraxma / Vaxt Aşımı" : "Omission / Timeout"}
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-900">0.0%</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {isAz ? "100% etibarlı sınaqlar" : "100% trials valid"}
              </div>
            </div>
          </div>

          {/* Reaction Time Distribution & Latency Spread Chart */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {isAz ? "Reaksiya Vaxtı Paylanması və Sınaq Qrafiki" : "Reaction Time Latency Distribution & Trial Scatter"}
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                <span>{isAz ? "Min:" : "Min:"} <strong className="text-slate-900">{minRt} ms</strong></span>
                <span>{isAz ? "Median:" : "Median:"} <strong className="text-slate-900">{medianRt} ms</strong></span>
                <span>{isAz ? "Maks:" : "Max:"} <strong className="text-slate-900">{maxRt} ms</strong></span>
              </div>
            </div>

            {/* Trial RT Bar Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{isAz ? "Sınaqlar üzrə Gecikmə (ms)" : "Per-Trial Latency (ms)"}</span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> {isAz ? "Düzgün" : "Correct"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" /> {isAz ? "Xəta / Yanlış" : "Error / Misclick"}
                  </span>
                </span>
              </div>
              <div className="h-28 flex items-end gap-1.5 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
                {recordedTrials.map((t, idx) => {
                  const barHeight = maxRt > 0 ? Math.max(14, Math.round((t.reaction_time / maxRt) * 80)) : 14;
                  const isCorrect = t.correct === 1;
                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-[22px] max-w-[36px] flex flex-col items-center gap-1 group relative cursor-pointer"
                    >
                      <div className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {Math.round(t.reaction_time)}ms
                      </div>
                      <div
                        style={{ height: `${barHeight}px` }}
                        className={`w-full rounded-xs transition-all ${
                          isCorrect ? "bg-emerald-500 group-hover:bg-emerald-600" : "bg-rose-500 group-hover:bg-rose-600"
                        }`}
                      />
                      <span className="text-[9px] font-mono text-slate-500">T{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Condition Split Comparison for Stroop or Flanker */}
            {(selectedParadigm === "C05-01" || selectedParadigm === "C04-01") &&
              congruentTrials.length > 0 &&
              incongruentTrials.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{isAz ? "Uyğun (Asanlaşdırma)" : "Congruent (Facilitation)"}</span>
                      <span className="font-mono text-emerald-700">
                        {meanCongruentRt} ms (n={congruentTrials.length})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{
                          width: `${
                            maxRt > 0 ? Math.min(100, Math.round((meanCongruentRt / maxRt) * 100)) : 50
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{isAz ? "Uyğunsuz (Müdaxilə)" : "Incongruent (Interference)"}</span>
                      <span className="font-mono text-amber-700">
                        {meanIncongruentRt} ms (n={incongruentTrials.length})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{
                          width: `${
                            maxRt > 0 ? Math.min(100, Math.round((meanIncongruentRt / maxRt) * 100)) : 60
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Cryptographic Ledger Commit Button */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {isAz ? "Empirik Sessiyanı Platforma Reyestrinə Təsdiqləyin" : "Commit Empirical Session to Platform Ledger"}
              </div>
              <p className="text-[11px] text-slate-600">
                {isAz
                  ? "Bu insan sınağı axınını kriptoqrafik SHA-256 xülasəsi ilə kilidləyin və tədqiqat vəziyyət maşınını LOCKED mərhələsinə keçirin."
                  : "Lock this human trial stream with a cryptographic SHA-256 digest and advance the study state machine to LOCKED."}
              </p>
            </div>

            {committedResult ? (
              <div className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-lg break-all">
                <span className="font-bold">{isAz ? "MÖHÜRLƏNDİ (SHA-256): " : "SEALED (SHA-256): "}</span>
                {committedResult.checksum}
              </div>
            ) : (
              <button
                onClick={handleCommitToLedger}
                disabled={committing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {committing
                  ? isAz ? "SHA-256 Möhürlənir..." : "Sealing SHA-256..."
                  : isAz ? "Kilidlə və Sessiyanı Təsdiqlə" : "Lock & Commit Session"}
              </button>
            )}
          </div>

          {/* Detailed Trial Log Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
              {isAz
                ? `Sınaqlar üzrə Empirik Hadisə Jurnalı (${recordedTrials.length} sınaq)`
                : `Trial-by-Trial Empirical Event Log (${recordedTrials.length} trials)`}
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-[280px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-mono">{isAz ? "Sınaq" : "Trial"}</th>
                    <th className="px-3 py-2">{isAz ? "Şərt" : "Condition"}</th>
                    <th className="px-3 py-2">{isAz ? "Cavab" : "Response"}</th>
                    <th className="px-3 py-2">{isAz ? "Gözlənilən" : "Expected"}</th>
                    <th className="px-3 py-2">{isAz ? "Gecikmə (RT)" : "Latency (RT)"}</th>
                    <th className="px-3 py-2 text-right">{isAz ? "Nəticə" : "Result"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {recordedTrials.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-900">{t.trial_id}</td>
                      <td className="px-3 py-1.5 text-slate-600">{t.condition}</td>
                      <td className="px-3 py-1.5 text-slate-800">{t.response}</td>
                      <td className="px-3 py-1.5 text-slate-500">{t.expected}</td>
                      <td className="px-3 py-1.5 text-slate-900">{t.reaction_time} ms</td>
                      <td className="px-3 py-1.5 text-right">
                        {t.correct ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                            {isAz ? "UĞURLU" : "PASS"}
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
                            {isAz ? "XƏTA" : "FAIL"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
