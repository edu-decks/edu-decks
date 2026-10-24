"use client";

import React from "react";
import { US_STATES } from "@/lib/states-data";
import type { StateData } from "@/lib/types";
import { cn } from "@/lib/utils";

function buildStarPolygonPoints(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

interface StateOutlineSvgProps {
  state: StateData;
  showCapitalStar?: boolean;
  showCapitalLabel?: boolean;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
}

/**
 * Renders an individual US state's silhouette/outline scaled cleanly to its bounding box,
 * with an optional gold star marker at the state capital's geographic location.
 */
export function StateOutlineSvg({
  state,
  showCapitalStar = false,
  showCapitalLabel = false,
  fillColor = "rgba(255, 255, 255, 0.22)",
  strokeColor = "#ffffff",
  className,
}: StateOutlineSvgProps) {
  const [bx, by, bw, bh] = state.bbox;
  const maxDim = Math.max(bw, bh, 18);
  const pad = maxDim * 0.24;

  // Center the state within a square-ish padded viewBox
  const cxBox = bx + bw / 2;
  const cyBox = by + bh / 2;
  const viewW = Math.max(bw + pad * 2, maxDim * 1.15);
  const viewH = Math.max(bh + pad * 2, maxDim * 0.95);
  const minX = cxBox - viewW / 2;
  const minY = cyBox - viewH / 2;

  const strokeW = Math.max(0.6, maxDim * 0.022);
  const starOuterR = Math.max(1.8, maxDim * 0.085);
  const starInnerR = starOuterR * 0.44;
  const [capX, capY] = state.capitalCoords;
  const fontSize = Math.max(3.2, maxDim * 0.11);

  // Place label above or below the star depending on vertical position in state
  const labelAbove = capY > cyBox;
  const labelY = labelAbove
    ? capY - starOuterR * 1.45
    : capY + starOuterR * 2.15;

  return (
    <svg
      viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${viewW.toFixed(1)} ${viewH.toFixed(1)}`}
      className={cn("w-full h-full overflow-visible select-none", className)}
      aria-label={`Outline of ${state.name}`}
    >
      <path
        d={state.svgPath}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeW}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {showCapitalStar && (
        <g>
          <circle
            cx={capX}
            cy={capY}
            r={starOuterR * 1.25}
            fill="rgba(0, 0, 0, 0.38)"
          />
          <polygon
            points={buildStarPolygonPoints(capX, capY, starOuterR, starInnerR)}
            fill="#ffd45e"
            stroke="#ffffff"
            strokeWidth={strokeW * 0.45}
            strokeLinejoin="round"
          />
        </g>
      )}

      {showCapitalLabel && (
        <text
          x={capX}
          y={labelY}
          textAnchor="middle"
          fill="#ffd45e"
          fontSize={fontSize}
          fontWeight={800}
          style={{
            paintOrder: "stroke",
            stroke: "rgba(0,0,0,0.65)",
            strokeWidth: `${strokeW * 1.4}px`,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        >
          {state.capital}
        </text>
      )}
    </svg>
  );
}

interface UsLocatorMapSvgProps {
  targetState: StateData;
  showCapitalStar?: boolean;
  className?: string;
}

/**
 * Renders the full 50-state Albers USA map with the target state highlighted in gold.
 * Automatically adds a callout ring for geographically small states so they are easy to spot.
 */
export function UsLocatorMapSvg({
  targetState,
  showCapitalStar = false,
  className,
}: UsLocatorMapSvgProps) {
  const [bx, by, bw, bh] = targetState.bbox;
  const isSmallState = Math.max(bw, bh) < 48;
  const centerX = bx + bw / 2;
  const centerY = by + bh / 2;
  const [capX, capY] = targetState.capitalCoords;

  return (
    <svg
      viewBox="-15 -5 1005 620"
      className={cn("w-full h-full select-none", className)}
      aria-label={`United States map highlighting ${targetState.name}`}
    >
      {/* Background states */}
      {US_STATES.map((s) => {
        const isTarget = s.abbr === targetState.abbr;
        if (isTarget) return null;
        return (
          <path
            key={s.abbr}
            d={s.svgPath}
            fill="rgba(255, 255, 255, 0.14)"
            stroke="rgba(255, 255, 255, 0.32)"
            strokeWidth={1.1}
            strokeLinejoin="round"
          />
        );
      })}

      {/* Highlighted target state rendered on top */}
      <path
        d={targetState.svgPath}
        fill="#ffd45e"
        stroke="#ffffff"
        strokeWidth={2.4}
        strokeLinejoin="round"
      />

      {/* Callout ring for small states (RI, DE, CT, NJ, MD, MA, NH, VT, HI) */}
      {isSmallState && (
        <circle
          cx={centerX}
          cy={centerY}
          r={24}
          fill="rgba(255, 212, 94, 0.18)"
          stroke="#ffd45e"
          strokeWidth={2.5}
          strokeDasharray="5 3"
        />
      )}

      {showCapitalStar && (
        <polygon
          points={buildStarPolygonPoints(capX, capY, 8.5, 3.8)}
          fill="#5ee8ff"
          stroke="#000000"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
