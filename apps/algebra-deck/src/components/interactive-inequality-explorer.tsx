"use client";

import React, { useState, useRef } from "react";
import { useSvgDrag } from "@/hooks/use-svg-drag";
import { cn } from "@/lib/utils";

const CYAN = "#5ee8ff";
const GOLD = "#ffd45e";

export type InequalitySign = "<" | ">" | "≤" | "≥";

type InequalityExplorerProps = {
  initialSign?: InequalitySign;
  initialBoundary?: number;
};

export function InteractiveInequalityExplorer({
  initialSign = ">",
  initialBoundary = 2,
}: InequalityExplorerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [sign, setSign] = useState<InequalitySign>(initialSign);
  const [boundary, setBoundary] = useState<number>(initialBoundary);
  const [testX, setTestX] = useState<number>(
    initialSign === ">" || initialSign === "≥"
      ? Math.min(6, initialBoundary + 2)
      : Math.max(-6, initialBoundary - 2)
  );
  const [dragTarget, setDragTarget] = useState<"boundary" | "test">("boundary");

  const VW = 320;
  const VH = 145;
  const lineY = 74;
  const minTick = -6;
  const maxTick = 6;
  const leftX = 32;
  const rightX = 288;
  const spanPx = rightX - leftX;

  const valToPx = (v: number) =>
    leftX + ((v - minTick) / (maxTick - minTick)) * spanPx;
  const pxToVal = (px: number) =>
    Math.max(
      minTick,
      Math.min(maxTick, Math.round(minTick + ((px - leftX) / spanPx) * (maxTick - minTick)))
    );

  const { handlePointerDown } = useSvgDrag({
    svgRef,
    viewBoxWidth: VW,
    viewBoxHeight: VH,
    onDragMove: (pt) => {
      const v = pxToVal(pt.x);
      if (dragTarget === "boundary") {
        setBoundary(Math.max(-5, Math.min(5, v)));
      } else {
        setTestX(v);
      }
    },
  });

  const isClosed = sign === "≤" || sign === "≥";
  const pointsRight = sign === ">" || sign === "≥";
  const boundPx = valToPx(boundary);
  const testPx = valToPx(testX);

  const isTrue =
    sign === ">"
      ? testX > boundary
      : sign === "≥"
      ? testX >= boundary
      : sign === "<"
      ? testX < boundary
      : testX <= boundary;

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
        {/* Base Number Line */}
        <line
          x1={leftX - 12}
          y1={lineY}
          x2={rightX + 12}
          y2={lineY}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={2.5}
        />
        {/* Left/Right arrowheads on base number line */}
        <polygon
          points={`${leftX - 16},${lineY} ${leftX - 8},${lineY - 4} ${leftX - 8},${lineY + 4}`}
          fill="rgba(255,255,255,0.45)"
        />
        <polygon
          points={`${rightX + 16},${lineY} ${rightX + 8},${lineY - 4} ${rightX + 8},${lineY + 4}`}
          fill="rgba(255,255,255,0.45)"
        />

        {/* Tick marks and integer labels */}
        {Array.from({ length: maxTick - minTick + 1 }).map((_, idx) => {
          const val = minTick + idx;
          const tx = valToPx(val);
          const isZero = val === 0;
          return (
            <g key={val}>
              <line
                x1={tx}
                y1={lineY - (isZero ? 7 : 4)}
                x2={tx}
                y2={lineY + (isZero ? 7 : 4)}
                stroke={isZero ? "#ffffff" : "rgba(255,255,255,0.5)"}
                strokeWidth={isZero ? 2 : 1.5}
              />
              {val % 2 === 0 && (
                <text
                  x={tx}
                  y={lineY + 21}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  className="font-mono text-[10px] font-bold"
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}

        {/* Highlighted Solution Ray */}
        <line
          x1={boundPx}
          y1={lineY}
          x2={pointsRight ? rightX + 10 : leftX - 10}
          y2={lineY}
          stroke={CYAN}
          strokeWidth={5}
        />
        {pointsRight ? (
          <polygon
            points={`${rightX + 16},${lineY} ${rightX + 5},${lineY - 6} ${rightX + 5},${lineY + 6}`}
            fill={CYAN}
          />
        ) : (
          <polygon
            points={`${leftX - 16},${lineY} ${leftX - 5},${lineY - 6} ${leftX - 5},${lineY + 6}`}
            fill={CYAN}
          />
        )}

        {/* Draggable Gold Boundary Circle (Open vs Closed) */}
        <g
          onPointerDown={(e) => {
            setDragTarget("boundary");
            handlePointerDown(e);
          }}
          className="cursor-ew-resize"
        >
          <circle cx={boundPx} cy={lineY} r={16} fill="rgba(255, 212, 94, 0.15)" />
          <circle
            cx={boundPx}
            cy={lineY}
            r={8}
            fill={isClosed ? GOLD : "#18181b"}
            stroke={GOLD}
            strokeWidth={3}
          />
          <text
            x={boundPx}
            y={lineY - 16}
            textAnchor="middle"
            fill={GOLD}
            className="font-mono font-bold text-xs"
          >
            {isClosed ? `Included (${boundary})` : `Open (${boundary})`}
          </text>
        </g>

        {/* Draggable Cyan Test Point */}
        <g
          onPointerDown={(e) => {
            setDragTarget("test");
            handlePointerDown(e);
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <line
            x1={testPx}
            y1={lineY + 26}
            x2={testPx}
            y2={lineY + 9}
            stroke={CYAN}
            strokeWidth={1.8}
            strokeDasharray="2 2"
          />
          <circle
            cx={testPx}
            cy={lineY + 34}
            r={7.5}
            fill={CYAN}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text
            x={testPx}
            y={lineY + 53}
            textAnchor="middle"
            fill={CYAN}
            className="font-mono font-bold text-[11px]"
          >
            test x = {testX}
          </text>
        </g>
      </svg>

      {/* Sign Switcher Pills */}
      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/25">
        {(["<", "≤", ">", "≥"] as InequalitySign[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSign(s)}
            className={cn(
              "px-3 py-0.5 rounded-full text-xs font-mono font-bold transition-all",
              sign === s ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
            )}
          >
            x {s} {boundary}
          </button>
        ))}
      </div>

      {/* Live Equation Banner */}
      <div className="w-full px-4 py-1.5 bg-black/35 border-y border-white/20 flex items-center justify-center gap-2 font-mono font-bold text-sm sm:text-base text-white">
        <span style={{ color: CYAN }}>x</span>
        <span>{sign}</span>
        <span style={{ color: GOLD }}>{boundary}</span>
        <span className="text-white/50">|</span>
        <span className="text-xs sm:text-sm">
          Test <span style={{ color: CYAN }}>{testX}</span> {sign}{" "}
          <span style={{ color: GOLD }}>{boundary}</span> is{" "}
          <span style={{ color: isTrue ? "#4ade80" : "#f87171" }} className="font-extrabold">
            {isTrue ? "TRUE" : "FALSE"}
          </span>
        </span>
      </div>
    </div>
  );
}
