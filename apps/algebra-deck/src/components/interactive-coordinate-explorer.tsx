"use client";

import React, { useState, useRef } from "react";
import { useSvgDrag } from "@/hooks/use-svg-drag";
import { StackedFraction } from "./ui/formatted-math-text";

const CYAN = "#5ee8ff";
const GOLD = "#ffd45e";
const LILAC = "#d8b4fe";

type CoordinateExplorerProps = {
  initialRise?: number;
  initialRun?: number;
  initialB?: number;
};

export function InteractiveCoordinateExplorer({
  initialRise = 2,
  initialRun = 1,
  initialB = 1,
}: CoordinateExplorerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [bVal, setBVal] = useState<number>(initialB);
  const [pointX, setPointX] = useState<number>(initialRun);
  const [pointY, setPointY] = useState<number>(initialB + initialRise);
  const [dragTarget, setDragTarget] = useState<"intercept" | "slope">("slope");

  const VW = 300;
  const VH = 175;
  const cx = 150;
  const cy = 88;
  const unit = 14; // [-5..5] vertically, [-6..6] horizontally
  const minCoord = -5;
  const maxCoord = 5;

  const toScreenX = (x: number) => cx + x * unit;
  const toScreenY = (y: number) => cy - y * unit;

  const { handlePointerDown } = useSvgDrag({
    svgRef,
    viewBoxWidth: VW,
    viewBoxHeight: VH,
    onDragMove: (pt) => {
      const gx = Math.max(minCoord, Math.min(maxCoord, Math.round((pt.x - cx) / unit)));
      const gy = Math.max(minCoord, Math.min(maxCoord, Math.round((cy - pt.y) / unit)));

      if (dragTarget === "intercept") {
        const clampedB = Math.max(-4, Math.min(4, gy));
        const deltaB = clampedB - bVal;
        setBVal(clampedB);
        setPointY((prevY) => Math.max(minCoord, Math.min(maxCoord, prevY + deltaB)));
      } else {
        // Keep pointX !== 0 so slope is always well-defined
        const safeX = gx === 0 ? (pointX >= 0 ? 1 : -1) : gx;
        setPointX(safeX);
        setPointY(gy);
      }
    },
  });

  const rise = pointY - bVal;
  const run = pointX;
  const slopeVal = rise / run;

  // Compute greatest common divisor to display reduced fraction when non-integer
  const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const divisor = gcd(rise, run);
  const simpRise = (run < 0 ? -rise : rise) / divisor;
  const simpRun = Math.abs(run) / divisor;
  const isIntegerSlope = simpRun === 1;

  // Line endpoints across [-6, 6]
  const x1 = -6;
  const y1 = slopeVal * x1 + bVal;
  const x2 = 6;
  const y2 = slopeVal * x2 + bVal;

  const bScreenX = toScreenX(0);
  const bScreenY = toScreenY(bVal);
  const pScreenX = toScreenX(pointX);
  const pScreenY = toScreenY(pointY);

  return (
    <div
      className="w-full flex flex-col items-center gap-1.5 select-none"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full max-w-[360px] h-auto overflow-visible touch-none"
      >
        <defs>
          <clipPath id="coord-grid-clip">
            <rect
              x={toScreenX(-6)}
              y={toScreenY(5.5)}
              width={12 * unit}
              height={11 * unit}
            />
          </clipPath>
        </defs>

        {/* Unit Grid Lines */}
        {Array.from({ length: 13 }).map((_, idx) => {
          const gv = -6 + idx;
          const sx = toScreenX(gv);
          return (
            <line
              key={`vg-${gv}`}
              x1={sx}
              y1={toScreenY(5)}
              x2={sx}
              y2={toScreenY(-5)}
              stroke={gv === 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)"}
              strokeWidth={gv === 0 ? 1.8 : 1}
            />
          );
        })}
        {Array.from({ length: 11 }).map((_, idx) => {
          const gv = -5 + idx;
          const sy = toScreenY(gv);
          return (
            <line
              key={`hg-${gv}`}
              x1={toScreenX(-6)}
              y1={sy}
              x2={toScreenX(6)}
              y2={sy}
              stroke={gv === 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)"}
              strokeWidth={gv === 0 ? 1.8 : 1}
            />
          );
        })}

        {/* Axis Labels */}
        <text x={toScreenX(6) + 8} y={cy + 4} fill="rgba(255,255,255,0.7)" className="font-mono text-[10px] font-bold">
          x
        </text>
        <text x={cx + 5} y={toScreenY(5) - 4} fill="rgba(255,255,255,0.7)" className="font-mono text-[10px] font-bold">
          y
        </text>

        {/* Slope Triangle: Gold horizontal run + Cyan vertical rise */}
        <line
          x1={bScreenX}
          y1={bScreenY}
          x2={pScreenX}
          y2={bScreenY}
          stroke={GOLD}
          strokeWidth={2.2}
          strokeDasharray="3 2"
        />
        <line
          x1={pScreenX}
          y1={bScreenY}
          x2={pScreenX}
          y2={pScreenY}
          stroke={CYAN}
          strokeWidth={2.2}
          strokeDasharray="3 2"
        />

        {/* Run & Rise Labels */}
        <text
          x={(bScreenX + pScreenX) / 2}
          y={bScreenY + (rise >= 0 ? 13 : -5)}
          textAnchor="middle"
          fill={GOLD}
          className="font-mono font-bold text-[10px]"
        >
          run={run}
        </text>
        <text
          x={pScreenX + (run >= 0 ? 24 : -24)}
          y={(bScreenY + pScreenY) / 2 + 3}
          textAnchor="middle"
          fill={CYAN}
          className="font-mono font-bold text-[10px]"
        >
          rise={rise}
        </text>

        {/* Plotted Line y = mx + b */}
        <g clipPath="url(#coord-grid-clip)">
          <line
            x1={toScreenX(x1)}
            y1={toScreenY(y1)}
            x2={toScreenX(x2)}
            y2={toScreenY(y2)}
            stroke="#ffffff"
            strokeWidth={2.8}
          />
        </g>

        {/* Draggable Gold y-intercept Handle (0, b) */}
        <g
          onPointerDown={(e) => {
            setDragTarget("intercept");
            handlePointerDown(e);
          }}
          className="cursor-ns-resize"
        >
          <circle cx={bScreenX} cy={bScreenY} r={14} fill="rgba(255, 212, 94, 0.2)" />
          <circle
            cx={bScreenX}
            cy={bScreenY}
            r={7.5}
            fill={GOLD}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text
            x={bScreenX + (run >= 0 ? -32 : 32)}
            y={bScreenY + 4}
            textAnchor="middle"
            fill={GOLD}
            className="font-mono font-bold text-[10px]"
          >
            (0, {bVal})
          </text>
        </g>

        {/* Draggable Cyan Slope Handle (pointX, pointY) */}
        <g
          onPointerDown={(e) => {
            setDragTarget("slope");
            handlePointerDown(e);
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <circle cx={pScreenX} cy={pScreenY} r={14} fill="rgba(94, 232, 255, 0.2)" />
          <circle
            cx={pScreenX}
            cy={pScreenY}
            r={7.5}
            fill={CYAN}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text
            x={pScreenX}
            y={pScreenY + (rise >= 0 ? -11 : 18)}
            textAnchor="middle"
            fill={CYAN}
            className="font-mono font-bold text-[10px]"
          >
            ({pointX}, {pointY})
          </text>
        </g>
      </svg>

      {/* Bottom Frosted Live Equation Banner */}
      <div className="w-full px-4 py-1.5 bg-black/35 border-y border-white/20 flex items-center justify-center gap-2 font-mono font-bold text-sm sm:text-base text-white">
        <span style={{ color: LILAC }}>y</span>
        <span className="text-white/60">=</span>
        <span style={{ color: CYAN }}>
          {isIntegerSlope ? (
            simpRise
          ) : (
            <StackedFraction numerator={String(simpRise)} denominator={String(simpRun)} />
          )}
        </span>
        <span>x</span>
        <span className="text-white/60">{bVal >= 0 ? "+" : "−"}</span>
        <span style={{ color: GOLD }}>{Math.abs(bVal)}</span>
        <span className="text-white/40 ml-2 text-xs">
          (m = <span style={{ color: CYAN }}>{rise}</span>/
          <span style={{ color: GOLD }}>{run}</span>, b ={" "}
          <span style={{ color: GOLD }}>{bVal}</span>)
        </span>
      </div>
    </div>
  );
}
