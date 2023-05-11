import Trade from "./trade";

export type Depth = {
  broker: string;
  size: number;
  bid: number;
  ask: number;
}

type Position = {
  pair: string;
  averagePrice: number;
  position: number;
  updates: number;
  lastPrice: number;
  change: number;
  percentageChange: number;
  high: number;
  low: number;
  oneWeek: number[];
  marketDepth: Depth[];
  trades: Trade [];
}

export const emptyPosition: Position = {
  pair: "",
  averagePrice: 0,
  position: 0,
  updates: 0,
  lastPrice: 0,
  change: 0,
  percentageChange: 0,
  high: 0,
  low: 0,
  oneWeek: [],
  marketDepth: [],
  trades: []
};

export default Position;