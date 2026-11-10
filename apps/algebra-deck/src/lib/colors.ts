import type { TopicType } from "./types";

/** Topic hex colors matching canonical EduDecks brand palette */
export const TOPIC_COLORS: Record<TopicType, string> = {
  expressions:  "#d97706", // Amber
  equations:    "#059669", // Brand Emerald
  inequalities: "#4f46e5", // Indigo
  graphing:     "#9333ea", // Purple
};

/** Human-readable label for each topic */
export const TOPIC_LABELS: Record<TopicType, string> = {
  expressions:  "Expressions",
  equations:    "Linear Equations",
  inequalities: "Inequalities",
  graphing:     "Lines & Slope",
};

/** Compact badge symbol for each topic in TopicSelector */
export const TOPIC_BADGES: Record<TopicType, string> = {
  expressions:  "3x",
  equations:    "=",
  inequalities: "< >",
  graphing:     "m",
};
