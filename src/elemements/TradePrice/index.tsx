import { FC }  from "react";
import { TraderDesktopCommands } from "../../contracts/TraderDesktopCommands";
import PriceMovement from "../PriceMovement";
import MarketDepth from "../MarketDepth";
import './TraderPrice.css';

const TraderPrice: FC<TraderDesktopCommands> = ({buy, sell}) => {
  return (
    <div className="mobilePrice">
      <div className="priceMovementCon">
        <div className="headerContainer">
          <div className="headerText">Price Movement</div>
        </div>
        <PriceMovement/>
      </div>
      <div className="marketDepthCon">
        <div className="headerContainer">
          <div className="headerText">Market Depth</div>
        </div>
        <MarketDepth 
          buy={(pair?: string, broker?: string, price?: number) => buy(pair, broker, price)} 
          sell={(pair?: string, broker?: string, price?: number) => sell(pair, broker, price)}
        />
      </div>
    </div>
  );
}

export default TraderPrice;