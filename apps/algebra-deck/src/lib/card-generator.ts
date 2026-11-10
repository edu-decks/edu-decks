import type {
  AlgebraCard,
  CardType,
  ComplexityTier,
  TopicType,
} from "./types";
import { TOPIC_COLORS } from "./colors";

const CYAN = "#5ee8ff";
const GOLD = "#ffd45e";
const LILAC = "#d8b4fe";

export type GenerateAlgebraCardOptions = {
  activeTopics: TopicType[];
  activeCardTypes: CardType[];
  complexity: ComplexityTier;
  includeNegatives: boolean;
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fmtSigned(n: number): string {
  return n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`;
}

function fmtNum(n: number): string {
  return n < 0 ? `−${Math.abs(n)}` : String(n);
}

// ── Concept Cards Catalogue ──────────────────────────────────────────────────

export const CONCEPT_CARDS: AlgebraCard[] = [
  // Expressions
  {
    id: "concept-expr-evaluate",
    topic: "expressions",
    cardType: "concept",
    complexity: "1-step",
    frontLabel: "Evaluating an expression",
    frontPrompt: "means…?",
    frontSpeechText: "Evaluating an expression means?",
    backDefinition: "Substitute a number for x and calculate",
    backDefinitionSubtitle: "Replace every x with its value, then follow order of operations",
    explorerKind: "variable-evaluate",
    explorerProps: { initialA: 3, initialB: 2, initialX: 4 },
    backSpeechText: "Substitute a number for x and calculate the total.",
    color: TOPIC_COLORS.expressions,
  },
  {
    id: "concept-expr-like-terms",
    topic: "expressions",
    cardType: "concept",
    complexity: "1-step",
    frontLabel: "Combining like terms",
    frontPrompt: "works by…?",
    frontSpeechText: "Combining like terms works by?",
    backDefinition: "ax + bx = (a + b)x",
    backDefinitionSubtitle: "Add coefficients of matching variable terms together",
    explorerKind: "combine-terms",
    explorerProps: { initialA: 3, initialB: 2 },
    backSpeechText: "a x plus b x equals a plus b, times x.",
    color: TOPIC_COLORS.expressions,
  },
  {
    id: "concept-expr-distributive",
    topic: "expressions",
    cardType: "concept",
    complexity: "2-step",
    frontLabel: "The distributive property",
    frontPrompt: "states that…?",
    frontSpeechText: "The distributive property states that?",
    backDefinition: "a(x + b) = ax + ab",
    backDefinitionSubtitle: "Multiply the outside factor by each term inside the parentheses",
    explorerKind: "distributive-area",
    explorerProps: { initialA: 3, initialB: 4 },
    backSpeechText: "a times open parenthesis x plus b close parenthesis equals a x plus a b.",
    color: TOPIC_COLORS.expressions,
  },

  // Linear Equations
  {
    id: "concept-eq-one-step",
    topic: "equations",
    cardType: "concept",
    complexity: "1-step",
    frontLabel: "One-step equations",
    frontPrompt: "are solved by…?",
    frontSpeechText: "One-step equations are solved by?",
    backDefinition: "Apply the inverse operation to both sides",
    backDefinitionSubtitle: "Undo + with − (or × with ÷) equally on both pans of the balance scale",
    explorerKind: "balance-one-step",
    explorerProps: { a: 1, b: 4, c: 0, d: 10 },
    backSpeechText: "Apply the inverse operation to both sides to isolate x.",
    color: TOPIC_COLORS.equations,
  },
  {
    id: "concept-eq-two-step",
    topic: "equations",
    cardType: "concept",
    complexity: "2-step",
    frontLabel: "Two-step equations",
    frontPrompt: "are solved by…?",
    frontSpeechText: "Two-step equations are solved by?",
    backDefinition: "1. Undo + / −   2. Undo × / ÷",
    backDefinitionSubtitle: "First remove the constant from both sides, then divide by the coefficient of x",
    explorerKind: "balance-two-step",
    explorerProps: { a: 2, b: 3, c: 0, d: 11 },
    backSpeechText: "First undo addition or subtraction on both sides, then divide by the coefficient of x.",
    color: TOPIC_COLORS.equations,
  },
  {
    id: "concept-eq-both-sides",
    topic: "equations",
    cardType: "concept",
    complexity: "multi-step",
    frontLabel: "Variables on both sides",
    frontPrompt: "are solved by…?",
    frontSpeechText: "Equations with variables on both sides are solved by?",
    backDefinition: "Collect all x terms on one side first",
    backDefinitionSubtitle: "Subtract the smaller x term from both sides, then isolate x",
    explorerKind: "balance-both-sides",
    explorerProps: { a: 3, b: 2, c: 1, d: 10 },
    backSpeechText: "Collect all x terms on one side first, then isolate x.",
    color: TOPIC_COLORS.equations,
  },

  // Inequalities
  {
    id: "concept-ineq-strict",
    topic: "inequalities",
    cardType: "concept",
    complexity: "1-step",
    frontLabel: "Strict inequalities (< and >)",
    frontPrompt: "are graphed with…?",
    frontSpeechText: "Strict inequalities less than and greater than are graphed with?",
    backDefinition: "An open circle ○ on the boundary",
    backDefinitionSubtitle: "The boundary number itself is not included in the solution ray",
    explorerKind: "inequality-ray",
    explorerProps: { initialSign: ">", initialBoundary: 2 },
    backSpeechText: "An open circle on the boundary number because the boundary itself is not included.",
    color: TOPIC_COLORS.inequalities,
  },
  {
    id: "concept-ineq-inclusive",
    topic: "inequalities",
    cardType: "concept",
    complexity: "1-step",
    frontLabel: "Inclusive inequalities (≤ and ≥)",
    frontPrompt: "are graphed with…?",
    frontSpeechText: "Inclusive inequalities less than or equal to and greater than or equal to are graphed with?",
    backDefinition: "A closed solid circle ● on the boundary",
    backDefinitionSubtitle: "The boundary number is included as part of the solution set",
    explorerKind: "inequality-ray",
    explorerProps: { initialSign: "≥", initialBoundary: -1 },
    backSpeechText: "A closed solid circle on the boundary number because it is included in the solution.",
    color: TOPIC_COLORS.inequalities,
  },
  {
    id: "concept-ineq-flip",
    topic: "inequalities",
    cardType: "concept",
    complexity: "multi-step",
    frontLabel: "Dividing an inequality by a negative",
    frontPrompt: "requires…?",
    frontSpeechText: "Dividing an inequality by a negative number requires?",
    backDefinition: "Flip the inequality sign (< ↔ >)",
    backDefinitionSubtitle: "Multiplying or dividing both sides by a negative reverses direction on the number line",
    explorerKind: "inequality-ray",
    explorerProps: { initialSign: "<", initialBoundary: -2 },
    backSpeechText: "Flip the inequality sign whenever you multiply or divide both sides by a negative number.",
    color: TOPIC_COLORS.inequalities,
  },

  // Graphing / Lines & Slope
  {
    id: "concept-graph-slope-intercept",
    topic: "graphing",
    cardType: "concept",
    complexity: "2-step",
    frontLabel: "Slope-intercept form",
    frontPrompt: "is…?",
    frontSpeechText: "Slope-intercept form of a linear equation is?",
    backDefinition: "y = mx + b",
    backDefinitionSubtitle: "slope (m) is steepness (rise / run) and y-intercept (b) is where the line crosses the y-axis",
    explorerKind: "coordinate-slope",
    explorerProps: { initialRise: 2, initialRun: 1, initialB: 1 },
    backSpeechText: "y equals m x plus b, where m is the slope and b is the y intercept.",
    color: TOPIC_COLORS.graphing,
  },
  {
    id: "concept-graph-slope",
    topic: "graphing",
    cardType: "concept",
    complexity: "1-step",
    frontLabel: "The slope of a line (m)",
    frontPrompt: "is…?",
    frontSpeechText: "The slope of a line m is?",
    backDefinition: "m = rise / run",
    backDefinitionSubtitle: "Vertical change (rise) divided by horizontal change (run) between any two points",
    explorerKind: "coordinate-slope",
    explorerProps: { initialRise: 3, initialRun: 2, initialB: -1 },
    backSpeechText: "Slope m equals rise divided by run.",
    color: TOPIC_COLORS.graphing,
  },
  {
    id: "concept-graph-intercept",
    topic: "graphing",
    cardType: "concept",
    complexity: "1-step",
    frontLabel: "The y-intercept (b)",
    frontPrompt: "is…?",
    frontSpeechText: "The y-intercept b is?",
    backDefinition: "Value of y where x = 0 → point (0, b)",
    backDefinitionSubtitle: "Where the line crosses the vertical y-axis",
    explorerKind: "coordinate-slope",
    explorerProps: { initialRise: 1, initialRun: 1, initialB: 2 },
    backSpeechText: "The value of y where x equals 0, at point 0 comma b on the vertical axis.",
    color: TOPIC_COLORS.graphing,
  },
];

// ── Practice Problem Generators by Topic ─────────────────────────────────────

function generateExpressionPractice(
  complexity: ComplexityTier,
  includeNegatives: boolean
): AlgebraCard {
  const color = TOPIC_COLORS.expressions;
  const xVal = includeNegatives ? randInt(-5, 6) || 2 : randInt(2, 7);

  if (complexity === "1-step") {
    const a = randInt(2, 6);
    const ans = a * xVal;
    return {
      id: `prac-expr-1-${Date.now()}-${Math.random()}`,
      topic: "expressions",
      cardType: "practice",
      complexity,
      frontPrompt: `Evaluate when x = ${fmtNum(xVal)}`,
      frontEquation: `${a}x`,
      frontHint: `Replace x with ${fmtNum(xVal)} and multiply: ${a} × ${fmtNum(xVal)}`,
      frontSpeechText: `Evaluate ${a} x when x equals ${fmtNum(xVal)}`,
      explorerKind: "variable-evaluate",
      explorerProps: {
        initialA: a,
        initialB: 0,
        initialX: Math.max(1, Math.min(7, Math.abs(xVal))),
      },
      backSteps: [
        {
          reason: "Given expression",
          equationTokens: [
            { id: "a", value: String(a), color: CYAN },
            { id: "x", value: "x" },
          ],
        },
        {
          reason: `Substitute x = ${fmtNum(xVal)}`,
          equationTokens: [
            { id: "a", value: String(a), color: CYAN },
            { id: "x", value: `(${fmtNum(xVal)})`, color: GOLD },
          ],
        },
        {
          reason: "Multiply",
          equationTokens: [{ id: "ans", value: fmtNum(ans) }],
        },
      ],
      backSpeechText: `Substitute x equals ${fmtNum(xVal)} into ${a} x to get ${fmtNum(ans)}.`,
      numericAnswer: ans,
      answerPrefix: "",
      color,
    };
  }

  if (complexity === "2-step") {
    const a = randInt(2, 5);
    const b = includeNegatives ? randInt(-6, 8) || 3 : randInt(1, 9);
    const prod = a * xVal;
    const ans = prod + b;
    const eqStr = `${a}x ${fmtSigned(b)}`;

    return {
      id: `prac-expr-2-${Date.now()}-${Math.random()}`,
      topic: "expressions",
      cardType: "practice",
      complexity,
      frontPrompt: `Evaluate when x = ${fmtNum(xVal)}`,
      frontEquation: eqStr,
      frontHint: `First multiply ${a} × ${fmtNum(xVal)}, then ${b >= 0 ? `add ${b}` : `subtract ${Math.abs(b)}`}.`,
      frontSpeechText: `Evaluate ${eqStr} when x equals ${fmtNum(xVal)}`,
      explorerKind: "variable-evaluate",
      explorerProps: {
        initialA: a,
        initialB: Math.max(0, b),
        initialX: Math.max(1, Math.min(7, Math.abs(xVal))),
      },
      backSteps: [
        {
          reason: "Given expression",
          formulaLine: eqStr,
        },
        {
          reason: `Substitute x = ${fmtNum(xVal)}`,
          formulaLine: `${a}(${fmtNum(xVal)}) ${fmtSigned(b)}`,
        },
        {
          reason: "Multiply first",
          formulaLine: `${fmtNum(prod)} ${fmtSigned(b)}`,
        },
        {
          reason: "Evaluate",
          formulaLine: fmtNum(ans),
        },
      ],
      backSpeechText: `${a} times ${fmtNum(xVal)} is ${fmtNum(prod)}, ${fmtSigned(b)} equals ${fmtNum(ans)}.`,
      numericAnswer: ans,
      answerPrefix: "",
      color,
    };
  }

  // multi-step: a(x + b) evaluated at xVal
  const a = randInt(2, 5);
  const b = randInt(1, 5);
  const inside = xVal + b;
  const ans = a * inside;
  const eqStr = `${a}(x + ${b})`;

  return {
    id: `prac-expr-3-${Date.now()}-${Math.random()}`,
    topic: "expressions",
    cardType: "practice",
    complexity,
    frontPrompt: `Evaluate when x = ${fmtNum(xVal)}`,
    frontEquation: eqStr,
    frontHint: `Distribute ${a}x + ${a * b} (or add inside parentheses first), then substitute x = ${fmtNum(xVal)}.`,
    frontSpeechText: `Evaluate ${a} times open parenthesis x plus ${b} close parenthesis when x equals ${fmtNum(xVal)}`,
    explorerKind: "distributive-area",
    explorerProps: { initialA: a, initialB: b },
    backSteps: [
      {
        reason: "Given expression",
        formulaLine: eqStr,
      },
      {
        reason: "Distribute",
        formulaLine: `${a}x + ${a * b}`,
      },
      {
        reason: `Substitute x = ${fmtNum(xVal)}`,
        formulaLine: `${a}(${fmtNum(xVal)}) + ${a * b}`,
      },
      {
        reason: "Evaluate",
        formulaLine: fmtNum(ans),
      },
    ],
    backSpeechText: `Distribute to get ${a} x plus ${a * b}, then substitute ${fmtNum(xVal)} to get ${fmtNum(ans)}.`,
    numericAnswer: ans,
    answerPrefix: "",
    color,
  };
}

function generateEquationPractice(
  complexity: ComplexityTier,
  includeNegatives: boolean
): AlgebraCard {
  const color = TOPIC_COLORS.equations;
  const xSol = includeNegatives ? randInt(-6, 8) || 3 : randInt(1, 9);

  if (complexity === "1-step") {
    const b = randInt(2, 9);
    const d = xSol + b;
    const eqStr = `x + ${b} = ${fmtNum(d)}`;
    return {
      id: `prac-eq-1-${Date.now()}-${Math.random()}`,
      topic: "equations",
      cardType: "practice",
      complexity,
      frontPrompt: "Solve for x",
      frontEquation: eqStr,
      frontHint: `Subtract ${b} from both sides of the equation to isolate x.`,
      frontSpeechText: `Solve for x: ${eqStr}`,
      explorerKind: "balance-one-step",
      explorerProps: {
        a: 1,
        b,
        c: 0,
        d: Math.max(2, d),
      },
      backSteps: [
        {
          reason: "Given equation",
          formulaLine: eqStr,
        },
        {
          reason: `Subtract ${b} from both sides`,
          formulaLine: `x = ${fmtNum(d)} − ${b}`,
        },
        {
          reason: "Evaluate",
          formulaLine: `x = ${fmtNum(xSol)}`,
        },
      ],
      backSpeechText: `Subtract ${b} from both sides: x equals ${fmtNum(xSol)}.`,
      numericAnswer: xSol,
      answerPrefix: "x = ",
      color,
    };
  }

  if (complexity === "2-step") {
    const a = randInt(2, 5);
    const b = randInt(1, 9);
    const d = a * xSol + b;
    const eqStr = `${a}x + ${b} = ${fmtNum(d)}`;
    return {
      id: `prac-eq-2-${Date.now()}-${Math.random()}`,
      topic: "equations",
      cardType: "practice",
      complexity,
      frontPrompt: "Solve for x",
      frontEquation: eqStr,
      frontHint: `Step 1: Subtract ${b} from both sides. Step 2: Divide both sides by ${a}.`,
      frontSpeechText: `Solve for x: ${eqStr}`,
      explorerKind: "balance-two-step",
      explorerProps: {
        a,
        b,
        c: 0,
        d: Math.max(4, d),
      },
      backSteps: [
        {
          reason: "Given equation",
          formulaLine: eqStr,
        },
        {
          reason: `Subtract ${b} from both sides`,
          formulaLine: `${a}x = ${fmtNum(d - b)}`,
        },
        {
          reason: `Divide both sides by ${a}`,
          formulaLine: `x = ${fmtNum(xSol)}`,
        },
      ],
      backSpeechText: `Subtract ${b} from both sides to get ${a} x equals ${fmtNum(d - b)}, then divide by ${a} to get x equals ${fmtNum(xSol)}.`,
      numericAnswer: xSol,
      answerPrefix: "x = ",
      color,
    };
  }

  // multi-step: ax + b = cx + d
  const c = randInt(1, 2);
  const a = c + randInt(2, 3);
  const b = randInt(1, 6);
  const d = (a - c) * xSol + b;
  const cTerm = c === 1 ? "x" : `${c}x`;
  const eqStr = `${a}x + ${b} = ${cTerm} ${fmtSigned(d)}`;

  return {
    id: `prac-eq-3-${Date.now()}-${Math.random()}`,
    topic: "equations",
    cardType: "practice",
    complexity,
    frontPrompt: "Solve for x",
    frontEquation: eqStr,
    frontHint: `First subtract ${cTerm} from both sides, then subtract ${b}, then divide by ${a - c}.`,
    frontSpeechText: `Solve for x: ${eqStr}`,
    explorerKind: "balance-both-sides",
    explorerProps: {
      a,
      b,
      c,
      d: Math.max(4, d),
    },
    backSteps: [
      {
        reason: "Given equation",
        formulaLine: eqStr,
      },
      {
        reason: `Subtract ${cTerm} from both sides`,
        formulaLine: `${a - c}x + ${b} = ${fmtNum(d)}`,
      },
      {
        reason: `Subtract ${b} from both sides`,
        formulaLine: `${a - c}x = ${fmtNum(d - b)}`,
      },
      {
        reason: `Divide both sides by ${a - c}`,
        formulaLine: `x = ${fmtNum(xSol)}`,
      },
    ],
    backSpeechText: `Subtract ${cTerm} from both sides, subtract ${b}, and divide by ${a - c} to get x equals ${fmtNum(xSol)}.`,
    numericAnswer: xSol,
    answerPrefix: "x = ",
    color,
  };
}

function generateInequalityPractice(
  complexity: ComplexityTier,
  includeNegatives: boolean
): AlgebraCard {
  const color = TOPIC_COLORS.inequalities;
  const bound = includeNegatives ? randInt(-4, 5) : randInt(1, 6);
  const sign = pickRandom([">", "<", "≥", "≤"] as const);

  if (complexity === "1-step") {
    const b = randInt(1, 6);
    const rhs = bound + b;
    const eqStr = `x + ${b} ${sign} ${fmtNum(rhs)}`;
    return {
      id: `prac-ineq-1-${Date.now()}-${Math.random()}`,
      topic: "inequalities",
      cardType: "practice",
      complexity,
      frontPrompt: `Solve for the boundary of x`,
      frontEquation: eqStr,
      frontHint: `Subtract ${b} from both sides just like an equation.`,
      frontSpeechText: `Solve the inequality ${eqStr}`,
      explorerKind: "inequality-ray",
      explorerProps: { initialSign: sign, initialBoundary: bound },
      backSteps: [
        {
          reason: "Given inequality",
          formulaLine: eqStr,
        },
        {
          reason: `Subtract ${b} from both sides`,
          formulaLine: `x ${sign} ${fmtNum(rhs)} − ${b}`,
        },
        {
          reason: "Evaluate",
          formulaLine: `x ${sign} ${fmtNum(bound)}`,
        },
      ],
      backSpeechText: `Subtract ${b} from both sides to get x ${sign} ${fmtNum(bound)}.`,
      numericAnswer: bound,
      answerPrefix: `x ${sign} `,
      color,
    };
  }

  const a = randInt(2, 4);
  const b = randInt(1, 7);
  const rhs = a * bound + b;
  const eqStr = `${a}x + ${b} ${sign} ${fmtNum(rhs)}`;

  return {
    id: `prac-ineq-2-${Date.now()}-${Math.random()}`,
    topic: "inequalities",
    cardType: "practice",
    complexity,
    frontPrompt: `Solve for the boundary of x`,
    frontEquation: eqStr,
    frontHint: `Subtract ${b} from both sides, then divide both sides by ${a}.`,
    frontSpeechText: `Solve the inequality ${eqStr}`,
    explorerKind: "inequality-ray",
    explorerProps: { initialSign: sign, initialBoundary: bound },
    backSteps: [
      {
        reason: "Given inequality",
        formulaLine: eqStr,
      },
      {
        reason: `Subtract ${b} from both sides`,
        formulaLine: `${a}x ${sign} ${fmtNum(rhs - b)}`,
      },
      {
        reason: `Divide both sides by ${a}`,
        formulaLine: `x ${sign} ${fmtNum(bound)}`,
      },
    ],
    backSpeechText: `Subtract ${b} from both sides, then divide by ${a} to get x ${sign} ${fmtNum(bound)}.`,
    numericAnswer: bound,
    answerPrefix: `x ${sign} `,
    color,
  };
}

function generateGraphingPractice(
  complexity: ComplexityTier,
  includeNegatives: boolean
): AlgebraCard {
  const color = TOPIC_COLORS.graphing;
  const m = includeNegatives ? pickRandom([-3, -2, -1, 1, 2, 3, 4]) : randInt(1, 4);
  const b = includeNegatives ? randInt(-4, 4) : randInt(0, 4);
  const mTerm = m === 1 ? "x" : m === -1 ? "−x" : `${fmtNum(m)}x`;
  const bTerm = b === 0 ? "" : ` ${fmtSigned(b)}`;
  const lineEq = `y = ${mTerm}${bTerm}`;

  if (complexity === "1-step") {
    const askSlope = Math.random() < 0.5;
    if (askSlope) {
      return {
        id: `prac-graph-1m-${Date.now()}-${Math.random()}`,
        topic: "graphing",
        cardType: "practice",
        complexity,
        frontPrompt: "Find the slope (m) of the line",
        frontEquation: lineEq,
        frontHint: "In y = mx + b, the slope m is the coefficient multiplying x.",
        frontSpeechText: `Find the slope m of the line ${lineEq}`,
        explorerKind: "coordinate-slope",
        explorerProps: { initialRise: m, initialRun: 1, initialB: b },
        backSteps: [
          {
            reason: "Given line equation",
            formulaLine: lineEq,
          },
          {
            reason: "Slope formula (y = mx + b)",
            formulaLine: `m = ${fmtNum(m)}`,
          },
        ],
        backSpeechText: `Comparing with y equals m x plus b, the slope m equals ${fmtNum(m)}.`,
        numericAnswer: m,
        answerPrefix: "m = ",
        color,
      };
    }

    return {
      id: `prac-graph-1b-${Date.now()}-${Math.random()}`,
      topic: "graphing",
      cardType: "practice",
      complexity,
      frontPrompt: "Find the y-intercept (b) of the line",
      frontEquation: lineEq,
      frontHint: "In y = mx + b, the y-intercept b is the constant term (the value of y when x = 0).",
      frontSpeechText: `Find the y intercept b of the line ${lineEq}`,
      explorerKind: "coordinate-slope",
      explorerProps: { initialRise: m, initialRun: 1, initialB: b },
      backSteps: [
        {
          reason: "Given line equation",
          formulaLine: lineEq,
        },
        {
          reason: "Substitute x = 0 for y-intercept",
          formulaLine: `b = ${fmtNum(b)}`,
        },
      ],
      backSpeechText: `When x equals 0, the y intercept b equals ${fmtNum(b)}.`,
      numericAnswer: b,
      answerPrefix: "b = ",
      color,
    };
  }

  // 2-step & multi-step: Find slope m from two points (0, b) and (run, y2)
  const run = randInt(1, 3);
  const rise = m * run;
  const y2 = b + rise;

  return {
    id: `prac-graph-2-${Date.now()}-${Math.random()}`,
    topic: "graphing",
    cardType: "practice",
    complexity,
    frontPrompt: "Find the slope (m) between the points",
    frontEquation: `(0, ${fmtNum(b)}) and (${run}, ${fmtNum(y2)})`,
    frontHint: `Use m = rise / run = (y₂ − y₁) / (x₂ − x₁).`,
    frontSpeechText: `Find the slope m between 0 comma ${fmtNum(b)} and ${run} comma ${fmtNum(y2)}`,
    explorerKind: "coordinate-slope",
    explorerProps: {
      initialRise: Math.max(-4, Math.min(4, rise)),
      initialRun: run,
      initialB: b,
    },
    backSteps: [
      {
        reason: "Slope formula",
        formulaLine: "m = (y₂ − y₁) / (x₂ − x₁)",
      },
      {
        reason: "Substitute points",
        formulaLine: `m = (${fmtNum(y2)} − ${fmtNum(b)}) / (${run} − 0)`,
      },
      {
        reason: "Evaluate rise / run",
        formulaLine: `m = ${fmtNum(rise)} / ${run} = ${fmtNum(m)}`,
      },
    ],
    backSpeechText: `Rise is ${fmtNum(rise)} and run is ${run}, so slope m equals ${fmtNum(m)}.`,
    numericAnswer: m,
    answerPrefix: "m = ",
    color,
  };
}

// ── Main Entry Point ─────────────────────────────────────────────────────────

export function generateAlgebraCard(
  options: GenerateAlgebraCardOptions
): AlgebraCard {
  const safeTopics: TopicType[] =
    options.activeTopics.length > 0
      ? options.activeTopics
      : ["expressions", "equations", "inequalities", "graphing"];
  const safeTypes: CardType[] =
    options.activeCardTypes.length > 0
      ? options.activeCardTypes
      : ["concept", "practice"];

  const chosenType = pickRandom(safeTypes);
  const chosenTopic = pickRandom(safeTopics);

  if (chosenType === "concept") {
    const matchingConcepts = CONCEPT_CARDS.filter((c) =>
      safeTopics.includes(c.topic)
    );
    const chosen =
      matchingConcepts.length > 0 ? pickRandom(matchingConcepts) : CONCEPT_CARDS[0];
    return {
      ...chosen,
      id: `${chosen.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
  }

  switch (chosenTopic) {
    case "expressions":
      return generateExpressionPractice(options.complexity, options.includeNegatives);
    case "equations":
      return generateEquationPractice(options.complexity, options.includeNegatives);
    case "inequalities":
      return generateInequalityPractice(options.complexity, options.includeNegatives);
    case "graphing":
      return generateGraphingPractice(options.complexity, options.includeNegatives);
  }
}
