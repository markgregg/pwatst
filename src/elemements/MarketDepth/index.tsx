import { FC, useEffect, useState, ReactNode } from "react";
import { useSelector } from "react-redux";
import { Depth } from "../../models/position";
import { RootState } from "../../state/store";
import { FaCaretDown, FaCaretUp, FaPlusSquare } from "react-icons/fa";
import "./MarketDepth.css";


const nummberformatter = Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const rateformatter = Intl.NumberFormat('default', { minimumFractionDigits: 1, maximumFractionDigits: 4 })

type Sort = {
  field: string;
  ascending: boolean;
}

export interface MarketDepthProps  {
  buy: (pair?: string, broker?: string, price?: number) => void;
  sell: (pair?: string, broker?: string, price?: number) => void;
}

const MarketDepth: FC<MarketDepthProps> = ({buy, sell}) => {
  const activePosition = useSelector((state: RootState) => state.position);
  const [sort,setSort] = useState<Sort>()
  const [sortedDepth, setSortedDepth] = useState<Depth[]>([]);

  useEffect(() => {
    if( sort ) {
      const depth = [...activePosition.marketDepth];
      let getter: (depth: Depth) => any;
      switch(sort.field) {
        case "broker":
          getter = d => d.broker;
          break;
        case "size":
          getter = d => d.size;
          break;
        case "bid":
          getter = d => d.bid;
          break;
        case "ask":
          getter = d => d.ask;
          break;
      }
      depth.sort( (a,b) => {
        return (getter(a) < getter(b)
          ? -1
          : getter(a) > getter(b)
            ? 1
            : 0) * (sort.ascending ? -1 : 1);
      });
      setSortedDepth(depth);
    } else {
      setSortedDepth(activePosition.marketDepth);
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
    <div className="marketDepth">
      <table>
        <thead className="marketDepthHeader">
          <tr>
            <th onClick={() => sortField("broker")}>Broker { getIcon("broker") }</th>
            <th onClick={() => sortField("ask")}>Ask { getIcon("ask") }</th>
            <th onClick={() => sortField("size")}>Size { getIcon("size") }</th>
            <th onClick={() => sortField("bid")}>Bid { getIcon("bid") }</th>
          </tr>
        </thead>
        <tbody className="marketDepthBody">
        {
          sortedDepth.map( depth => 
            <tr key={depth.broker}>
              <td>{depth.broker}</td>
              <td>
                <div 
                  className="marketDepthPrice"
                  onClick={() => buy(activePosition.pair, depth.broker, depth.bid)}
                > 
                  {rateformatter.format(depth.bid)}
                  <FaPlusSquare className="depthBuy"/>
                  </div>
              </td>
              <td>{nummberformatter.format(depth.size)}</td>
              <td>
                <div 
                  className="marketDepthPrice"
                  onClick={() => sell(activePosition.pair, depth.broker, depth.ask)}
                >
                  {rateformatter.format(depth.ask)}
                  <FaPlusSquare className="depthSell"/>
                </div>
              </td>
            </tr>
          )
        }
        </tbody>
      </table>
    </div>
  );
}

export default MarketDepth;