"use client";

import React, { useState, useRef } from "react";
import { useSvgDrag } from "@/hooks/use-svg-drag";
import { cn } from "@/lib/utils";

const CYAN = "#5ee8ff";
const GOLD = "#ffd45e";
const LILAC = "#d8b4fe";

type BalanceExplorerProps = {
  mode: "balance-one-step" | "balance-two-step" | "balance-both-sides";
  a?: number; // left x coefficient
  b?: number; // left constant
  c?: number; // right x coefficient (0 for 1-step and 2-step)
  d?: number; // right constant
};

export function InteractiveBalanceExplorer({
  mode,
  a = mode === "balance-one-step" ? 1 : mode === "balance-two-step" ? 2 : 3,
  b = mode === "balance-one-step" ? 4 : mode === "balance-two-step" ? 3 : 2,
  c = mode === "balance-both-sides" ? 1 : 0,
  d = mode === "balance-one-step" ? 10 : mode === "balance-two-step" ? 11 : 10,
}: BalanceExplorerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const solutionX = Math.round((d - b) / Math.max(1, a - c));
  const [testX, setTestX] = useState<number>(solutionX);
  const [stepIdx, setStepIdx] = useState<number>(0);

  const VW = 320;
  const VH = 155;

  const { handlePointerDown } = useSvgDrag({
    svgRef,
    viewBoxWidth: VW,
    viewBoxHeight: VH,
    onDragMove: (pt) => {
      // Map slider x [55..265] to testX [0..10]
      const val = Math.max(0, Math.min(10, Math.round(((pt.x - 55) / 210) * 10)));
      setTestX(val);
    },
  });

  // Compute current pan representations based on stepIdx
  let leftXCount = a;
  let leftConst = b;
  let rightXCount = c;
  let rightConst = d;

  if (mode === "balance-one-step") {
    if (stepIdx >= 1) {
      leftConst = 0;
      rightConst = d - b;
    }
  } else if (mode === "balance-two-step") {
    if (stepIdx === 1) {
      leftConst = 0;
      rightConst = d - b;
    } else if (stepIdx >= 2) {
      leftXCount = 1;
      leftConst = 0;
      rightConst = solutionX;
    }
  } else {
    // balance-both-sides: e.g. 3x + 2 = x + 10
    if (stepIdx === 1) {
      leftXCount = a - c;
      rightXCount = 0;
    } else if (stepIdx >= 2) {
      leftXCount = 1;
      leftConst = 0;
      rightXCount = 0;
      rightConst = solutionX;
    }
  }

  const leftWeight = leftXCount * testX + leftConst;
  const rightWeight = rightXCount * testX + rightConst;
  const diff = rightWeight - leftWeight;
  const isBalanced = diff === 0;
  const tiltDeg = Math.max(-12, Math.min(12, diff * 1.8));

  const sliderX = 55 + (testX / 10) * 210;

  const steps =
    mode === "balance-one-step"
      ? [`1. ${a > 1 ? `${a}x` : "x"} + ${b} = ${d}`, `2. Subtract ${b}: x = ${solutionX}`]
      : mode === "balance-two-step"
      ? [
          `1. ${a}x + ${b} = ${d}`,
          `2. −${b}: ${a}x = ${d - b}`,
          `3. ÷${a}: x = ${solutionX}`,
        ]
      : [
          `1. ${a}x + ${b} = x + ${d}`,
          `2. −x: ${a - c}x + ${b} = ${d}`,
          `3. Solve: x = ${solutionX}`,
        ];

  const formatSide = (xCount: number, con: number) => {
    const parts: string[] = [];
    if (xCount > 0) parts.push(xCount === 1 ? "x" : `${xCount}x`);
    if (con > 0 || parts.length === 0) parts.push(String(con));
    return parts.join(" + ");
  };

  return (
    <div
      className="w-full flex flex-col items-center gap-1.5 select-none"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full max-w-[380px] h-auto overflow-visible touch-none"
      >
        {/* Center Fulcrum Base */}
        <polygon
          points="144,106 176,106 160,76"
          fill="rgba(255,255,255,0.2)"
          stroke="#ffffff"
          strokeWidth={2}
        />
        <line
          x1={120}
          y1={106}
          x2={200}
          y2={106}
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Tilting Beam Group centered at (160, 76) */}
        <g
          style={{
            transform: `rotate(${tiltDeg}deg)`,
            transformOrigin: "160px 76px",
            transition: "transform 0.2s ease-out",
          }}
        >
          {/* Main Beam */}
          <line
            x1={56}
            y1={76}
            x2={264}
            y2={76}
            stroke={isBalanced ? "#ffffff" : "rgba(255,255,255,0.75)"}
            strokeWidth={3.5}
            strokeLinecap="round"
          />

          {/* Left Pan */}
          <line x1={80} y1={76} x2={80} y2={62} stroke="#ffffff" strokeWidth={2} />
          <line x1={38} y1={62} x2={122} y2={62} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />

          {/* Left Pan Blocks */}
          <g>
            {Array.from({ length: leftXCount }).map((_, i) => (
              <g key={`lx-${i}`}>
                <rect
                  x={42 + i * 24}
                  y={36}
                  width={22}
                  height={24}
                  rx={4}
                  fill="rgba(94, 232, 255, 0.28)"
                  stroke={CYAN}
                  strokeWidth={1.8}
                />
                <text
                  x={53 + i * 24}
                  y={52}
                  textAnchor="middle"
                  fill="#ffffff"
                  className="font-mono font-bold text-[11px]"
                >
                  x
                </text>
              </g>
            ))}
            {leftConst > 0 && (
              <g>
                <rect
                  x={42 + leftXCount * 24 + 2}
                  y={40}
                  width={28}
                  height={20}
                  rx={4}
                  fill="rgba(255, 212, 94, 0.28)"
                  stroke={GOLD}
                  strokeWidth={1.8}
                />
                <text
                  x={42 + leftXCount * 24 + 16}
                  y={54}
                  textAnchor="middle"
                  fill={GOLD}
                  className="font-mono font-bold text-[11px]"
                >
                  +{leftConst}
                </text>
              </g>
            )}
            <text
              x={80}
              y={26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              className="font-mono font-bold text-[11px]"
            >
              {formatSide(leftXCount, leftConst)} = {leftWeight}
            </text>
          </g>

          {/* Right Pan */}
          <line x1={240} y1={76} x2={240} y2={62} stroke="#ffffff" strokeWidth={2} />
          <line x1={198} y1={62} x2={282} y2={62} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />

          {/* Right Pan Blocks */}
          <g>
            {Array.from({ length: rightXCount }).map((_, i) => (
              <g key={`rx-${i}`}>
                <rect
                  x={204 + i * 24}
                  y={36}
                  width={22}
                  height={24}
                  rx={4}
                  fill="rgba(94, 232, 255, 0.28)"
                  stroke={CYAN}
                  strokeWidth={1.8}
                />
                <text
                  x={215 + i * 24}
                  y={52}
                  textAnchor="middle"
                  fill="#ffffff"
                  className="font-mono font-bold text-[11px]"
                >
                  x
                </text>
              </g>
            ))}
            {rightConst > 0 && (
              <g>
                <rect
                  x={204 + rightXCount * 24 + (rightXCount > 0 ? 2 : 16)}
                  y={38}
                  width={38}
                  height={22}
                  rx={4}
                  fill="rgba(255, 212, 94, 0.28)"
                  stroke={GOLD}
                  strokeWidth={1.8}
                />
                <text
                  x={204 + rightXCount * 24 + (rightXCount > 0 ? 21 : 35)}
                  y={53}
                  textAnchor="middle"
                  fill={GOLD}
                  className="font-mono font-bold text-xs"
                >
                  {rightConst}
                </text>
              </g>
            )}
            <text
              x={240}
              y={26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              className="font-mono font-bold text-[11px]"
            >
              {formatSide(rightXCount, rightConst)} = {rightWeight}
            </text>
          </g>
        </g>

        {/* Center Balance Status Badge */}
        <text
          x={160}
          y={68}
          textAnchor="middle"
          fill={isBalanced ? "#4ade80" : GOLD}
          className="font-mono font-bold text-xs"
        >
          {isBalanced ? "BALANCED (=)" : leftWeight < rightWeight ? "<" : ">"}
        </text>

        {/* Draggable Test x Slider */}
        <text x={14} y={136} fill={CYAN} className="font-mono font-bold text-xs">
          x={testX}
        </text>
        <line
          x1={55}
          y1={132}
          x2={265}
          y2={132}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <g
          onPointerDown={handlePointerDown}
          className="cursor-grab active:cursor-grabbing"
        >
          <circle cx={sliderX} cy={132} r={14} fill="rgba(94, 232, 255, 0.2)" />
          <circle
            cx={sliderX}
            cy={132}
            r={8.5}
            fill={CYAN}
            stroke="#ffffff"
            strokeWidth={2}
          />
        </g>
        <text x={274} y={136} fill="rgba(255,255,255,0.7)" className="font-mono text-[10px]">
          drag x
        </text>
      </svg>

      {/* Step Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/25">
        {steps.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => setStepIdx(idx)}
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-headline font-bold transition-all",
              stepIdx === idx ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Live Equation Banner */}
      <div className="w-full px-4 py-1.5 bg-black/35 border-y border-white/20 flex items-center justify-center gap-2 font-mono font-bold text-sm sm:text-base text-white">
        <span>At </span>
        <span style={{ color: CYAN }}>x = {testX}</span>
        <span className="text-white/50">:</span>
        <span>{leftWeight}</span>
        <span style={{ color: isBalanced ? "#4ade80" : GOLD }}>
          {isBalanced ? "=" : leftWeight < rightWeight ? "<" : ">"}
        </span>
        <span>{rightWeight}</span>
        {isBalanced && (
          <span style={{ color: LILAC }} className="ml-1 font-extrabold">
            (Solution: x = {solutionX})
          </span>
        )}
      </div>
    </div>
  );
}
