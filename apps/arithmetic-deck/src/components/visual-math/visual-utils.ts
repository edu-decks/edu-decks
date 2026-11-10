import { MathProblem } from "@/lib/types";

// Greatest Common Divisor helper
export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

// Least Common Multiple helper
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

// Determine whether the problem numbers are small enough to cleanly render the visual diagram
export function canShowVisualDiagram(problem: MathProblem): boolean {
  const { operation, num1, num2, answer } = problem;

  if (problem.isFraction) {
    if (!problem.frac1 || !problem.frac2) return false;
    const f1 = problem.frac1;
    const f2 = problem.frac2;
    if (f1.d <= 0 || f2.d <= 0) return false;

    const commonD = lcm(f1.d, f2.d);
    const c1 = f1.n * (commonD / f1.d);
    const c2 = f2.n * (commonD / f2.d);

    if (operation === "+") {
      const totalFilled = c1 + c2;
      const pieCount = Math.ceil(totalFilled / commonD);
      return commonD <= 24 && pieCount <= 4 && totalFilled <= 36;
    }

    if (operation === "-") {
      const pieCount = Math.ceil(c1 / commonD);
      return commonD <= 24 && pieCount <= 4 && c1 <= 36;
    }

    if (operation === "×") {
      return f1.n <= f1.d && f2.n <= f2.d && f1.d <= 12 && f2.d <= 12 && f1.d * f2.d <= 64;
    }

    if (operation === "÷") {
      const totalBoxes = commonD > 12 ? Math.max(c1, c2) : Math.max(commonD, c1, c2);
      return totalBoxes <= 20;
    }

    return false;
  }

  if (operation === "×" || operation === "÷") {
    return !(Math.abs(num1) > 144 || Math.abs(num2) > 12 || Math.abs(answer) > 100);
  }

  return !(Math.abs(num1) > 100 || Math.abs(num2) > 100 || Math.abs(answer) > 100);
}

// Helper to construct SVG path data for rectangles with individual corner radii
export function getRoundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
  tr: number,
  br: number,
  bl: number
): string {
  const maxR = Math.min(w / 2, h / 2);
  const rTL = Math.max(0, Math.min(tl, maxR));
  const rTR = Math.max(0, Math.min(tr, maxR));
  const rBR = Math.max(0, Math.min(br, maxR));
  const rBL = Math.max(0, Math.min(bl, maxR));

  const safeTL = rTL === 0 ? 0.001 : rTL;
  const safeTR = rTR === 0 ? 0.001 : rTR;
  const safeBR = rBR === 0 ? 0.001 : rBR;
  const safeBL = rBL === 0 ? 0.001 : rBL;

  return [
    `M ${x + safeTL} ${y}`,
    `L ${x + w - safeTR} ${y}`,
    `A ${safeTR} ${safeTR} 0 0 1 ${x + w} ${y + safeTR}`,
    `L ${x + w} ${y + h - safeBR}`,
    `A ${safeBR} ${safeBR} 0 0 1 ${x + w - safeBR} ${y + h}`,
    `L ${x + safeBL} ${y + h}`,
    `A ${safeBL} ${safeBL} 0 0 1 ${x} ${y + h - safeBL}`,
    `L ${x} ${y + safeTL}`,
    `A ${safeTL} ${safeTL} 0 0 1 ${x + safeTL} ${y}`,
    'Z',
  ].join(' ');
}
