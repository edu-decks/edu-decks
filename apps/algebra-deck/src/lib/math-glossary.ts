export interface GlossaryEntry {
  explanation: string;
  formula?: string;
}

const GLOSSARY: Record<string, GlossaryEntry> = {
  "given": {
    explanation: "Start with the original algebra problem before making any changes.",
  },
  "substitute": {
    explanation: "Replace the variable letter (x) with its known number value so you can calculate the result.",
    formula: "If x = 4, then 3x + 2 becomes 3(4) + 2",
  },
  "multiply": {
    explanation: "In order of operations (PEMDAS), multiply the coefficient by x before adding or subtracting constants.",
  },
  "combine like terms": {
    explanation: "Group x-terms together with x-terms, and plain numbers (constants) together with plain numbers.",
    formula: "ax + bx = (a + b)x",
  },
  "distribute": {
    explanation: "Multiply the number outside the parentheses by every term inside the parentheses.",
    formula: "a(x + b) = ax + ab",
  },
  "subtract from both sides": {
    explanation: "To keep an equation balanced like a scale, whatever you subtract from the left side must also be subtracted from the right side.",
  },
  "add to both sides": {
    explanation: "Undo subtraction by adding the same number to both sides of the equals sign so the scale stays balanced.",
  },
  "divide both sides": {
    explanation: "Undo multiplication by dividing both sides by the coefficient in front of x to isolate a single x.",
  },
  "multiply both sides": {
    explanation: "Undo division by multiplying both sides by the denominator so x stands alone.",
  },
  "flip inequality sign": {
    explanation: "Multiplying or dividing both sides by a negative number reverses the order on the number line, so < flips to > (and ≤ flips to ≥).",
  },
  "slope formula": {
    explanation: "Slope (m) measures how steep a line is: divide the vertical change (rise) by the horizontal change (run).",
    formula: "m = rise / run = (y₂ − y₁) / (x₂ − x₁)",
  },
  "y-intercept": {
    explanation: "The y-intercept (b) is the value of y where the line crosses the vertical y-axis (when x = 0).",
    formula: "y = mx + b  →  at x = 0, y = b",
  },
  "evaluate": {
    explanation: "Carry out the final arithmetic operation to simplify down to a single number.",
  },
};

export function lookupGlossary(reason: string): GlossaryEntry | null {
  const lower = reason.toLowerCase();
  if (lower.includes("given")) return GLOSSARY["given"];
  if (lower.includes("substitute")) return GLOSSARY["substitute"];
  if (lower.includes("combine like")) return GLOSSARY["combine like terms"];
  if (lower.includes("distribute")) return GLOSSARY["distribute"];
  if (lower.includes("subtract") && lower.includes("side")) return GLOSSARY["subtract from both sides"];
  if (lower.includes("subtract") && lower.includes("x")) return GLOSSARY["subtract from both sides"];
  if (lower.includes("add") && lower.includes("side")) return GLOSSARY["add to both sides"];
  if (lower.includes("flip") && lower.includes("sign")) return GLOSSARY["flip inequality sign"];
  if (lower.includes("divide") && lower.includes("side")) return GLOSSARY["divide both sides"];
  if (lower.includes("multiply") && lower.includes("side")) return GLOSSARY["multiply both sides"];
  if (lower.includes("multiply")) return GLOSSARY["multiply"];
  if (lower.includes("slope")) return GLOSSARY["slope formula"];
  if (lower.includes("y-intercept") || lower.includes("intercept")) return GLOSSARY["y-intercept"];
  if (lower.includes("evaluate") || lower.includes("simplify") || lower.includes("add") || lower.includes("subtract")) {
    return GLOSSARY["evaluate"];
  }
  return null;
}
