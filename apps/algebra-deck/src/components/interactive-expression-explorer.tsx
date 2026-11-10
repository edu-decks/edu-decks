"use client";

import React, { useState, useRef } from "react";
import { useSvgDrag } from "@/hooks/use-svg-drag";
import { cn } from "@/lib/utils";

const CYAN = "#5ee8ff";
const GOLD = "#ffd45e";
const LILAC = "#d8b4fe";

type ExpressionExplorerProps = {
  mode: "variable-evaluate" | "combine-terms" | "distributive-area";
  initialA?: number;
  initialB?: number;
  initialX?: number;
};

export function InteractiveExpressionExplorer({
  mode,
  initialA = 3,
  initialB = 2,
  initialX = 4,
}: ExpressionExplorerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [xVal, setXVal] = useState(initialX);
  const [aVal, setAVal] = useState(initialA);
  const [bVal, setBVal] = useState(initialB);
  const [splitStep, setSplitStep] = useState<0 | 1>(0);
  const [dragTarget, setDragTarget] = useState<"x" | "a" | "b">("x");

  const VW = 320;
  const VH = 155;

  const { handlePointerDown } = useSvgDrag({
    svgRef,
    viewBoxWidth: VW,
    viewBoxHeight: VH,
    onDragMove: (pt) => {
      if (mode === "variable-evaluate") {
        // Map x coordinate [40..260] to xVal [1..7]
        const nextX = Math.max(1, Math.min(7, Math.round((pt.x - 36) / 28)));
        setXVal(nextX);
      } else if (mode === "combine-terms") {
        if (dragTarget === "a") {
          const nextA = Math.max(1, Math.min(5, Math.round((pt.x - 30) / 36)));
          setAVal(nextA);
        } else {
          const nextB = Math.max(1, Math.min(5, Math.round((pt.x - 30) / 36)));
          setBVal(nextB);
        }
      } else if (mode === "distributive-area") {
        if (dragTarget === "a") {
          const nextA = Math.max(1, Math.min(5, Math.round((pt.y - 22) / 22)));
          setAVal(nextA);
        } else {
          const nextB = Math.max(1, Math.min(6, Math.round((pt.x - 135) / 24)));
          setBVal(nextB);
        }
      }
    },
  });

  if (mode === "variable-evaluate") {
    const coeff = initialA;
    const constant = initialB;
    const unitPx = 11;
    const startX = 28;
    const barY = 48;
    const barH = 32;
    const xBarWidth = xVal * unitPx;
    const totalXWidth = coeff * xBarWidth;
    const constWidth = Math.abs(constant) * unitPx;
    const totalVal = coeff * xVal + constant;

    // Slider handle X position for xVal [1..7]
    const sliderX = 36 + xVal * 28;

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
          {/* Subtle 1x1 background grid */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={20 + i * 20}
              y1={16}
              x2={20 + i * 20}
              y2={100}
              stroke="rgba(255,255,255,0.10)"
              strokeDasharray="2 3"
            />
          ))}
          {[28, 48, 68, 88].map((y, i) => (
            <line
              key={`h-${i}`}
              x1={20}
              y1={y}
              x2={300}
              y2={y}
              stroke="rgba(255,255,255,0.10)"
              strokeDasharray="2 3"
            />
          ))}

          {/* Render `coeff` Cyan x-blocks */}
          {Array.from({ length: coeff }).map((_, idx) => {
            const bx = startX + idx * (xBarWidth + 3);
            return (
              <g key={idx}>
                <rect
                  x={bx}
                  y={barY}
                  width={xBarWidth}
                  height={barH}
                  rx={5}
                  fill="rgba(94, 232, 255, 0.22)"
                  stroke={CYAN}
                  strokeWidth={2}
                />
                {/* Internal unit ticks inside each x block */}
                {Array.from({ length: Math.max(0, xVal - 1) }).map((__, u) => (
                  <line
                    key={u}
                    x1={bx + (u + 1) * unitPx}
                    y1={barY + 3}
                    x2={bx + (u + 1) * unitPx}
                    y2={barY + barH - 3}
                    stroke="rgba(94, 232, 255, 0.35)"
                    strokeDasharray="2 2"
                  />
                ))}
                <text
                  x={bx + xBarWidth / 2}
                  y={barY + 20}
                  textAnchor="middle"
                  fill={CYAN}
                  className="font-mono font-bold text-[11px]"
                >
                  x={xVal}
                </text>
              </g>
            );
          })}

          {/* Gold constant block */}
          {constant > 0 && (
            <g>
              <rect
                x={startX + totalXWidth + coeff * 3 + 4}
                y={barY}
                width={constWidth}
                height={barH}
                rx={5}
                fill="rgba(255, 212, 94, 0.22)"
                stroke={GOLD}
                strokeWidth={2}
              />
              <text
                x={startX + totalXWidth + coeff * 3 + 4 + constWidth / 2}
                y={barY + 20}
                textAnchor="middle"
                fill={GOLD}
                className="font-mono font-bold text-[11px]"
              >
                +{constant}
              </text>
            </g>
          )}

          {/* Top brace label */}
          <text
            x={VW / 2}
            y={32}
            textAnchor="middle"
            fill="rgba(255,255,255,0.85)"
            className="font-headline font-bold text-xs"
          >
            {coeff} blocks of x ({coeff} × {xVal} = {coeff * xVal}) + {constant} = {totalVal}
          </text>

          {/* Draggable x slider track */}
          <line
            x1={64}
            y1={126}
            x2={232}
            y2={126}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <text
            x={26}
            y={130}
            fill={CYAN}
            className="font-mono font-bold text-xs"
          >
            Drag x:
          </text>
          <g
            onPointerDown={handlePointerDown}
            className="cursor-grab active:cursor-grabbing"
          >
            <circle
              cx={sliderX}
              cy={126}
              r={15}
              fill="rgba(94, 232, 255, 0.2)"
            />
            <circle
              cx={sliderX}
              cy={126}
              r={9}
              fill={CYAN}
              stroke="#ffffff"
              strokeWidth={2}
            />
            <text
              x={sliderX}
              y={149}
              textAnchor="middle"
              fill={CYAN}
              className="font-mono font-bold text-[11px]"
            >
              x = {xVal}
            </text>
          </g>
        </svg>

        {/* Bottom Frosted Equation Banner */}
        <div className="w-full px-4 py-1.5 bg-black/35 border-y border-white/20 flex items-center justify-center gap-2 font-mono font-bold text-sm sm:text-base text-white">
          <span>{coeff}(</span>
          <span style={{ color: CYAN }}>{xVal}</span>
          <span>) + </span>
          <span style={{ color: GOLD }}>{constant}</span>
          <span className="text-white/60">=</span>
          <span style={{ color: CYAN }}>{coeff * xVal}</span>
          <span className="text-white/60">+</span>
          <span style={{ color: GOLD }}>{constant}</span>
          <span className="text-white/60">=</span>
          <span style={{ color: LILAC }} className="text-base sm:text-lg font-extrabold">
            {totalVal}
          </span>
        </div>
      </div>
    );
  }

  if (mode === "combine-terms") {
    const sum = aVal + bVal;
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
          {/* Row 1: Cyan a*x tiles */}
          <text x={18} y={48} fill={CYAN} className="font-mono font-bold text-xs">
            {aVal}x
          </text>
          {Array.from({ length: aVal }).map((_, i) => (
            <g key={`a-${i}`}>
              <rect
                x={46 + i * 36}
                y={30}
                width={30}
                height={26}
                rx={5}
                fill="rgba(94, 232, 255, 0.25)"
                stroke={CYAN}
                strokeWidth={2}
              />
              <text
                x={61 + i * 36}
                y={47}
                textAnchor="middle"
                fill="#ffffff"
                className="font-mono font-bold text-xs"
              >
                x
              </text>
            </g>
          ))}
          {/* Drag handle for aVal */}
          <g
            onPointerDown={(e) => {
              setDragTarget("a");
              handlePointerDown(e);
            }}
            className="cursor-ew-resize"
          >
            <circle
              cx={46 + aVal * 36 + 6}
              cy={43}
              r={8}
              fill={CYAN}
              stroke="#ffffff"
              strokeWidth={2}
            />
          </g>

          {/* Row 2: Gold b*x tiles */}
          <text x={18} y={92} fill={GOLD} className="font-mono font-bold text-xs">
            {bVal}x
          </text>
          {Array.from({ length: bVal }).map((_, i) => {
            const bx = splitStep === 1 ? 46 + (aVal + i) * 26 : 46 + i * 36;
            const by = splitStep === 1 ? 118 : 74;
            const bw = splitStep === 1 ? 22 : 30;
            return (
              <g key={`b-${i}`}>
                <rect
                  x={bx}
                  y={by}
                  width={bw}
                  height={26}
                  rx={5}
                  fill="rgba(255, 212, 94, 0.25)"
                  stroke={GOLD}
                  strokeWidth={2}
                />
                <text
                  x={bx + bw / 2}
                  y={by + 17}
                  textAnchor="middle"
                  fill="#ffffff"
                  className="font-mono font-bold text-xs"
                >
                  x
                </text>
              </g>
            );
          })}
          {splitStep === 0 && (
            <g
              onPointerDown={(e) => {
                setDragTarget("b");
                handlePointerDown(e);
              }}
              className="cursor-ew-resize"
            >
              <circle
                cx={46 + bVal * 36 + 6}
                cy={87}
                r={8}
                fill={GOLD}
                stroke="#ffffff"
                strokeWidth={2}
              />
            </g>
          )}

          {/* Combined row preview at bottom */}
          <text x={46} y={136} fill="rgba(255,255,255,0.85)" className="font-headline font-bold text-xs">
            Total like terms: {aVal} + {bVal} = {sum} tiles of x → {sum}x
          </text>
        </svg>

        {/* Frosted Step Pill */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/25">
          <button
            type="button"
            onClick={() => setSplitStep(0)}
            className={cn(
              "px-3 py-0.5 rounded-full text-xs font-headline font-bold transition-all",
              splitStep === 0 ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
            )}
          >
            1. Separate ({aVal}x + {bVal}x)
          </button>
          <button
            type="button"
            onClick={() => setSplitStep(1)}
            className={cn(
              "px-3 py-0.5 rounded-full text-xs font-headline font-bold transition-all",
              splitStep === 1 ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
            )}
          >
            2. Combine ({sum}x)
          </button>
        </div>

        <div className="w-full px-4 py-1.5 bg-black/35 border-y border-white/20 flex items-center justify-center gap-2 font-mono font-bold text-sm sm:text-base text-white">
          <span style={{ color: CYAN }}>{aVal}x</span>
          <span className="text-white/60">+</span>
          <span style={{ color: GOLD }}>{bVal}x</span>
          <span className="text-white/60">=</span>
          <span>(</span>
          <span style={{ color: CYAN }}>{aVal}</span>
          <span className="text-white/60">+</span>
          <span style={{ color: GOLD }}>{bVal}</span>
          <span>)x</span>
          <span className="text-white/60">=</span>
          <span style={{ color: LILAC }} className="text-base sm:text-lg font-extrabold">
            {sum}x
          </span>
        </div>
      </div>
    );
  }

  // mode === "distributive-area": Area model for a(x + b) = ax + ab
  const cell = 20;
  const xCols = 4; // Visual width of 'x' section
  const rectX = 56;
  const rectY = 26;
  const xWidth = xCols * cell;
  const bWidth = bVal * cell;
  const heightPx = aVal * cell;
  const gap = splitStep === 1 ? 16 : 0;

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
        {/* Left Rectangle: a * x */}
        <rect
          x={rectX}
          y={rectY}
          width={xWidth}
          height={heightPx}
          fill="rgba(94, 232, 255, 0.18)"
          stroke="#ffffff"
          strokeWidth={2}
        />
        {/* Unit rows inside a * x */}
        {Array.from({ length: aVal - 1 }).map((_, r) => (
          <line
            key={`rx-${r}`}
            x1={rectX}
            y1={rectY + (r + 1) * cell}
            x2={rectX + xWidth}
            y2={rectY + (r + 1) * cell}
            stroke="rgba(255,255,255,0.18)"
            strokeDasharray="2 3"
          />
        ))}
        <text
          x={rectX + xWidth / 2}
          y={rectY + heightPx / 2 + 4}
          textAnchor="middle"
          fill={CYAN}
          className="font-mono font-bold text-sm"
        >
          {aVal}x
        </text>
        <text
          x={rectX + xWidth / 2}
          y={rectY - 7}
          textAnchor="middle"
          fill="#ffffff"
          className="font-mono font-bold text-xs"
        >
          x
        </text>

        {/* Right Rectangle: a * b (with 1x1 unit grid) */}
        <rect
          x={rectX + xWidth + gap}
          y={rectY}
          width={bWidth}
          height={heightPx}
          fill="rgba(255, 212, 94, 0.18)"
          stroke="#ffffff"
          strokeWidth={2}
        />
        {Array.from({ length: aVal - 1 }).map((_, r) => (
          <line
            key={`rb-r-${r}`}
            x1={rectX + xWidth + gap}
            y1={rectY + (r + 1) * cell}
            x2={rectX + xWidth + gap + bWidth}
            y2={rectY + (r + 1) * cell}
            stroke="rgba(255,255,255,0.18)"
            strokeDasharray="2 3"
          />
        ))}
        {Array.from({ length: bVal - 1 }).map((_, c) => (
          <line
            key={`rb-c-${c}`}
            x1={rectX + xWidth + gap + (c + 1) * cell}
            y1={rectY}
            x2={rectX + xWidth + gap + (c + 1) * cell}
            y2={rectY + heightPx}
            stroke="rgba(255,255,255,0.18)"
            strokeDasharray="2 3"
          />
        ))}
        <text
          x={rectX + xWidth + gap + bWidth / 2}
          y={rectY + heightPx / 2 + 4}
          textAnchor="middle"
          fill={GOLD}
          className="font-mono font-bold text-sm"
        >
          {aVal * bVal}
        </text>
        <text
          x={rectX + xWidth + gap + bWidth / 2}
          y={rectY - 7}
          textAnchor="middle"
          fill={GOLD}
          className="font-mono font-bold text-xs"
        >
          +{bVal}
        </text>

        {/* Left height label a */}
        <text
          x={rectX - 14}
          y={rectY + heightPx / 2 + 4}
          textAnchor="middle"
          fill={CYAN}
          className="font-mono font-bold text-sm"
        >
          {aVal}
        </text>

        {/* Cyan Handle for height `a` */}
        <g
          onPointerDown={(e) => {
            setDragTarget("a");
            handlePointerDown(e);
          }}
          className="cursor-ns-resize"
        >
          <circle
            cx={rectX}
            cy={rectY + heightPx}
            r={8}
            fill={CYAN}
            stroke="#ffffff"
            strokeWidth={2}
          />
        </g>

        {/* Gold Handle for width `b` */}
        <g
          onPointerDown={(e) => {
            setDragTarget("b");
            handlePointerDown(e);
          }}
          className="cursor-ew-resize"
        >
          <circle
            cx={rectX + xWidth + gap + bWidth}
            cy={rectY + heightPx / 2}
            r={8}
            fill={GOLD}
            stroke="#ffffff"
            strokeWidth={2}
          />
        </g>
      </svg>

      {/* Step Pill */}
      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/25">
        <button
          type="button"
          onClick={() => setSplitStep(0)}
          className={cn(
            "px-3 py-0.5 rounded-full text-xs font-headline font-bold transition-all",
            splitStep === 0 ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
          )}
        >
          1. Combined: {aVal}(x + {bVal})
        </button>
        <button
          type="button"
          onClick={() => setSplitStep(1)}
          className={cn(
            "px-3 py-0.5 rounded-full text-xs font-headline font-bold transition-all",
            splitStep === 1 ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
          )}
        >
          2. Split Area: {aVal}x + {aVal * bVal}
        </button>
      </div>

      {/* Bottom Frosted Equation Banner */}
      <div className="w-full px-4 py-1.5 bg-black/35 border-y border-white/20 flex items-center justify-center gap-1.5 font-mono font-bold text-sm sm:text-base text-white">
        <span style={{ color: CYAN }}>{aVal}</span>
        <span>(x + </span>
        <span style={{ color: GOLD }}>{bVal}</span>
        <span>)</span>
        <span className="text-white/60">=</span>
        <span style={{ color: CYAN }}>{aVal}</span>
        <span>x + </span>
        <span style={{ color: CYAN }}>{aVal}</span>
        <span>·</span>
        <span style={{ color: GOLD }}>{bVal}</span>
        <span className="text-white/60">=</span>
        <span className="font-extrabold">
          <span style={{ color: CYAN }}>{aVal}x</span> +{" "}
          <span style={{ color: GOLD }}>{aVal * bVal}</span>
        </span>
      </div>
    </div>
  );
}
