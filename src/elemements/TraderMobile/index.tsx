import { FC }  from "react";
import { TraderDesktopCommands } from "../../contracts/TraderDesktopCommands";
import Portfolio from "../Portfolio";
import Trades from "../Trades";
import './TraderMobile.css';

const TraderMobile: FC<TraderDesktopCommands> = ({buy, sell}) => {
  return (
    <div className="mobileTrader">
      <div className="headerContainer">
        <div className='headerText'>Portfolio</div>
      </div>
      <Portfolio/>
      <div className="headerContainer">
        <div className='headerText'>Trades</div>
      </div>
      <Trades/>
    </div>
  );
}

export default TraderMobile;