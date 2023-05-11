import { Depth, Position, Trade } from "../models";

export const brokers = ["LHAM", "CHASE", "BARC", "POLIC", "SANT", "REND"];

export const currencyPairs = [
  { pair: 'USD/GBP', rate: 1.2046 },
  { pair: 'GBP/EUR', rate: 1.1317 },
  { pair: 'EUR/USD', rate: 1.0635 },
  { pair: 'GBP/JPY', rate: 163.5730 },
  { pair: 'USD/JPY', rate: 135.8310 },
  { pair: 'GBP/AUD', rate: 1.7789 },
  { pair: 'GBP/BRL', rate: 6.2609 },
  { pair: 'GBP/CAD', rate: 1.6368 },
  { pair: 'GBP/CHF', rate: 1.1271 },
  { pair: 'GBP/CNY', rate: 8.3132 },
  { pair: 'GBP/INR', rate: 98.3110 },
  { pair: 'GBP/NOK', rate: 12.4981 },
  { pair: 'GBP/QAR', rate: 4.3825 },
  { pair: 'GBP/ZAR', rate: 21.8218 },
  { pair: 'EUR/CHF', rate: 0.9954 },
  { pair: 'EUR/CAD', rate: 1.4454 },
  { pair: 'EUR/JPY', rate: 144.4760 },
  { pair: 'EUR/SEK', rate: 11.1161 },
  { pair: 'EUR/HUF', rate: 378.8100 },
  { pair: 'USD/CAD', rate: 1.3593 },
  { pair: 'USD/HKD', rate: 7.8489 },
  { pair: 'USD/SGD', rate: 1.3436 },
  { pair: 'USD/INR', rate: 81.6600 },
  { pair: 'USD/MXN', rate: 17.9410 },
  { pair: 'USD/CNY', rate: 6.9043 },
  { pair: 'USD/CHF', rate: 0.9357 }
];
export const getPositions = (): Position[] => {
  let tradeId = 100001;
  return currencyPairs.map( cp => {
    const base = cp.rate * 10000;
    const noBrokers =  Math.floor(Math.random() * 3) + 3;
    const marketDepth: Depth[] = [];
    for (let index = 0; index < noBrokers; index++) {
      let brokerIdx = -1;
      while( brokerIdx === -1) {
        brokerIdx = Math.floor(Math.random() * 6);
        const broker = brokers[brokerIdx];
        if( marketDepth.find( depth => depth.broker === broker) ) {
          brokerIdx = -1;
        }
      }
      const bid = Math.floor(Math.random() * (base * .05));
      const ask = Math.floor(Math.random() * (base * .05));
      marketDepth.push({
        broker: brokers[brokerIdx],
        size:  Math.floor(Math.random() * 1000) * 1000,
        bid: (base + bid) / 10000,
        ask: (base - ask) / 10000
      });
    }
    const tradeCnt = Math.floor(Math.random() * 20) + 5;
    const trades: Trade[] = [];
    for (let index = 0; index < tradeCnt; index++) {
      const rateChng = Math.floor(Math.random() * (base * .05));
      const delta = Math.floor(Math.random() * 1) > 0 ? rateChng : rateChng * -1;
      const brIdx = Math.floor(Math.random() * brokers.length);
      trades.push({
        id: tradeId++,
        buySell: Math.floor(Math.random() * 10) > 4 ? 'BUY' : 'SELL',
        pair: cp.pair,
        broker: brokers[brIdx],
        price: (base + delta) / 10000,
        size: Math.floor(Math.random() * 100) * 100
      })
    }
    return {
      pair: cp.pair,
      averagePrice: cp.rate,
      position: (Math.floor(Math.random() * 1000) * 1000) * (Math.floor(Math.random() * 5) > 3 ? -1 : 1),
      updates: 1,
      lastPrice: cp.rate,
      change: 0,
      percentageChange: 0,
      high: cp.rate,
      low: cp.rate,
      oneWeek: [0,1,2,3,4,5,6].map( () => {
        const rateChng = Math.floor(Math.random() * (base * .05));
        const delta = Math.floor(Math.random() * 1) > 0 ? rateChng : rateChng * -1;
        return (base + delta) / 10000;
      }),
      marketDepth,
      trades
    }
  });
}