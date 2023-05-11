import { useState, FC, KeyboardEvent } from "react";
import { BuySell } from "../../models";
import { brokers, currencyPairs } from "../../services/positions";

import "./Trade.css";

export interface EnterTradeProperties {
  instanceId?: string;
  buySell?: BuySell;
  pair?: string;
  price?: number;
  broker?: string;
  close: (component: string, id: string) => void;
}
 
const rateFormat = Intl.NumberFormat('default', { minimumFractionDigits: 1, maximumFractionDigits: 4 });

const EnterTrade: FC<EnterTradeProperties> = ({instanceId, pair, price, buySell, broker, close}) => {
  const [tradeBuySell,setTradeBuySell] = useState<BuySell>(buySell ??  'BUY');
  const [tradePair,setTradePair] = useState<string>(pair ??  currencyPairs[0].pair);
  const [tradePrice,setTradePrice] = useState<number>(price ??  currencyPairs[0].rate);
  const [tradeSize,setTradeSize] = useState<number>(0);
  const [tradeBroker,setTradeBroker] = useState<string>( broker ??  brokers[0]);
  
  const restrictToLong = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = +event.code;
    if( key < 48 || key > 57) {
        event.stopPropagation();
        event.preventDefault();
    }
  }

  const restrictToDecimal = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = +event.code;
    if( (key < 48 || key > 57) && 
      key !== 45 &&
      key !== 46 ) {
        event.stopPropagation();
        event.preventDefault();
    }
  }

  const toggleSide = () => {
    setTradeBuySell(tradeBuySell === 'BUY' ? 'SELL' : 'BUY');
  }

  return (
    <div 
      className="tradeEntryForm"
    >
      <div 
        className={'tradeEntrySide ' + (tradeBuySell === 'BUY' ? 'tradeEntryBuy' : 'tradeEntrySell')}
        onClick={toggleSide}
      >{ tradeBuySell === 'BUY' ? 'Buy' : 'Sell'}</div>
      <div className="tradeContent">
        <div className="tradeInputs">
          <div className="tradeText">
            <label>Pair</label>
            <label>Broker</label>
            <label>Price</label>
            <label>Size</label>
          </div>
          <div className="tradeValues">
            <select 
              name="pair" 
              id="pair" 
              className="tradePair"
              value={tradePair}
              onChange={e => setTradePair(e.target.value)}
            >
              {
                currencyPairs.map( cp => 
                  <option key={cp.pair} value={cp.pair}>{cp.pair}</option>    
                )
              }
            </select>
            <select 
              name="broker" 
              id="broker" 
              className="tradeBroker" 
              value={tradeBroker}
              onChange={e => setTradeBroker(e.target.value)}
            >
            {
              brokers.map( br => 
                <option key={br} value={br}>{br}</option>    
              )
            }
            </select>
            <input 
              type="number"
              id="price" 
              name="price" 
              value={rateFormat.format(tradePrice)}
              onKeyDown={restrictToDecimal}
              className="tradePrice"
              onChange={e => setTradePrice(+e.target.value)}
            />
            
            <input 
              type="number" 
              id="size" 
              name="size" 
              value={tradeSize}
              onKeyDown={restrictToLong}
              className="tradeSize"
              onChange={e => setTradeSize(+e.target.value)}
            />
          </div>
        </div>
        <div className="tradeButtons">
          <div
            className="tradeEnter"
            onClick={() => close('tradeEnter', instanceId!)}
          >Enter</div>
          <div 
            className="tradeCancel"
            onClick={() => close('tradeEnter', instanceId!)}
          >Cancel</div>
        </div>
      </div>
    </div>
  );
}

export default EnterTrade;