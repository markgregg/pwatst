import { useEffect, useState, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import "./Trades.css";
import { Trade } from "../../models";


const nummberformatter = Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const rateformatter = Intl.NumberFormat('default', { minimumFractionDigits: 1, maximumFractionDigits: 4 })

type Sort = {
  field: string;
  ascending: boolean;
}

const Trades = () => {
  const activePosition = useSelector((state: RootState) => state);
  const [sort,setSort] = useState<Sort>()
  const [sortedTrades, setSortedTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if( sort ) {
      const trades = [...activePosition.position.trades];
      let getter: (trade: Trade) => any;
      switch(sort.field) {
        case "id":
          getter = d => d.id;
          break;
        case "buysell":
          getter = d => d.buySell;
          break;
        case "broker":
          getter = d => d.broker;
          break;
        case "size":
          getter = d => d.size;
          break;
        case "price":
          getter = d => d.price;
          break;
      }
      trades.sort( (a,b) => {
        return (getter(a) < getter(b)
          ? -1
          : getter(a) > getter(b)
            ? 1
            : 0) * (sort.ascending ? -1 : 1);
      });
      setSortedTrades(trades);
    } else {
      setSortedTrades(activePosition.position.trades);
    }
  }, [activePosition,sort]);

  const getIcon = (field: string): ReactNode => {
    return sort && sort.field === field ? (sort.ascending ? <FaCaretDown/> : <FaCaretUp/>) : <></>
  }

  const sortField = (field: string) => {
    if( sort?.field === field ) {
      setSort( {
        field,
        ascending: !sort.ascending
      });
    } else {
      setSort( {
        field,
        ascending: true
      });
    }
  }

  return (
    <div className="trades">
      <table>
        <thead className="tradesHeader">
          <tr>
            <th onClick={() => sortField("id")}>ID { getIcon("id") }</th>
            <th onClick={() => sortField("buysell")}>BuySell { getIcon("buysell") }</th>
            <th onClick={() => sortField("broker")}>Broker { getIcon("broker") }</th>
            <th onClick={() => sortField("price")}>Ask { getIcon("price") }</th>
            <th onClick={() => sortField("size")}>Size { getIcon("size") }</th>
          </tr>
        </thead>
        <tbody>
        {
          sortedTrades.map( trade => 
            <tr key={trade.id}>
              <td>{trade.id}</td>
              <td className={trade.buySell === 'BUY' ? 'tradesBuy' : 'tradesSell'}>{trade.buySell}</td>
              <td>{trade.broker}</td>
              <td>{trade.price ? rateformatter.format(trade.price) : ""}</td>
              <td>{trade.size ? nummberformatter.format(trade.size) : "" }</td>
            </tr>
          )
        }
        </tbody>
      </table>
    </div>
  );
}

export default Trades;