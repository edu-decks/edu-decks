import React from "react";

const FRACTION_MAP: Record<string, [string, string]> = {
  "½": ["1", "2"],
  "⅓": ["1", "3"],
  "⅔": ["2", "3"],
  "¼": ["1", "4"],
  "¾": ["3", "4"],
};

export function StackedFraction({
  numerator,
  denominator,
  className = "",
}: {
  numerator: string;
  denominator: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-bold leading-none select-none text-[0.8em] -translate-y-[1.5px] ${className}`}
    >
      <span className="border-b-[1.5px] border-current px-0.5 pb-[1.5px] leading-none text-center">
        {numerator}
      </span>
      <span className="pt-[1.5px] leading-none text-center">{denominator}</span>
    </span>
  );
}

const COLOR_KEYWORDS: Record<string, string> = {
  "slope (m)": "#5ee8ff",
  "rise": "#5ee8ff",
  "run": "#ffd45e",
  "y-intercept (b)": "#ffd45e",
  "y-intercept": "#ffd45e",
  "variable (x)": "#5ee8ff",
  "constant": "#ffd45e",
};

export function FormattedMathText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const pattern =
    /(y = mx \+ b|m = rise \/ run|a\(x \+ b\) = ax \+ ab|ax \+ bx = \(a \+ b\)x|½|⅓|⅔|¼|¾|slope \(m\)|y-intercept \(b\)|y-intercept|variable \(x\)|\brise\b|\brun\b|\bconstant\b)/g;
  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part === "y = mx + b") {
          return (
            <React.Fragment key={idx}>
              <span style={{ color: "#d8b4fe" }} className="font-bold">y</span>
              <span> = </span>
              <span style={{ color: "#5ee8ff" }} className="font-bold">m</span>
              <span>x + </span>
              <span style={{ color: "#ffd45e" }} className="font-bold">b</span>
            </React.Fragment>
          );
        }
        if (part === "m = rise / run") {
          return (
            <React.Fragment key={idx}>
              <span style={{ color: "#5ee8ff" }} className="font-bold">m</span>
              <span> = </span>
              <StackedFraction numerator="rise" denominator="run" />
            </React.Fragment>
          );
        }
        if (part === "a(x + b) = ax + ab") {
          return (
            <React.Fragment key={idx}>
              <span style={{ color: "#5ee8ff" }} className="font-bold">a</span>
              <span>(x + </span>
              <span style={{ color: "#ffd45e" }} className="font-bold">b</span>
              <span>) = </span>
              <span style={{ color: "#5ee8ff" }} className="font-bold">a</span>
              <span>x + </span>
              <span style={{ color: "#5ee8ff" }} className="font-bold">a</span>
              <span style={{ color: "#ffd45e" }} className="font-bold">b</span>
            </React.Fragment>
          );
        }
        if (part === "ax + bx = (a + b)x") {
          return (
            <React.Fragment key={idx}>
              <span style={{ color: "#5ee8ff" }} className="font-bold">a</span>
              <span>x + </span>
              <span style={{ color: "#ffd45e" }} className="font-bold">b</span>
              <span>x = (</span>
              <span style={{ color: "#5ee8ff" }} className="font-bold">a</span>
              <span> + </span>
              <span style={{ color: "#ffd45e" }} className="font-bold">b</span>
              <span>)x</span>
            </React.Fragment>
          );
        }
        if (FRACTION_MAP[part]) {
          const [num, den] = FRACTION_MAP[part];
          return <StackedFraction key={idx} numerator={num} denominator={den} />;
        }
        if (COLOR_KEYWORDS[part]) {
          return (
            <span key={idx} style={{ color: COLOR_KEYWORDS[part] }} className="font-bold">
              {part}
            </span>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
}
