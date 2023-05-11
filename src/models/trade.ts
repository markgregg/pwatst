export type BuySell = 'BUY' | 'SELL';

type Trade = {
  id?: number;
  buySell: BuySell;
  pair: string;
  broker: string;
  price?: number;
  size?: number;
}

export default Trade