export type RegionType =
  | "northeast"
  | "southeast"
  | "midwest"
  | "southwest"
  | "west";

export type CardMode =
  | "state-to-capital"
  | "capital-to-state"
  | "map-to-state";

export interface StateData {
  /** 2-letter US postal abbreviation, e.g. "CA" */
  abbr: string;
  /** Full state name, e.g. "California" */
  name: string;
  /** State capital city, e.g. "Sacramento" */
  capital: string;
  /** US geographic region */
  region: RegionType;
  /** Official or well-known state nickname */
  nickname: string;
  /** Capital coordinates [x, y] in the 975x610 Albers USA projection space */
  capitalCoords: [number, number];
  /** Bounding box [minX, minY, width, height] in the 975x610 Albers USA space */
  bbox: [number, number, number, number];
  /** SVG path string d="M..." in the 975x610 Albers USA projection space */
  svgPath: string;
}

export interface StatesCard {
  id: string;
  state: StateData;
  mode: CardMode;
  region: RegionType;
  color: string;
  frontSpeechText: string;
  backSpeechText: string;
}
