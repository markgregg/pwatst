import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TraderDesktopCommands } from '../../contracts/TraderDesktopCommands';
import { RootState } from '../../state/store';
import { registerIntent, deregisterIntent, api } from 'pwa-synergy-api'
import './Toolbar.css';

interface Trade {
  broker: string;
  pair: string;
  side: string;
  type: string;
}

const Toolbar: FC<TraderDesktopCommands> = ({buy, sell, setMainPage}) => {
  const activePosition = useSelector((state: RootState) => state);

  useEffect(() => {
    const actionIntent = (action: string, trade: Trade, domain: string, subDomain: string) => {
      console.log(trade);
      if( trade.side === 'BUY') {
        buy(trade.pair, trade.broker);
      } else {
        sell(trade.pair, trade.broker);
      }
      window.focus();
    }
    
    console.log("Adding listener")
    registerIntent("test", actionIntent);
    return () => deregisterIntent("test", actionIntent)
  }, []);

  return (
    <div className='toolbar'>
      <ul>
        <li 
          className='buy'
          onClick={ () => buy(undefined, undefined, undefined)}
        >Buy</li>
        <li 
          className='sell'
          onClick={() => sell(undefined, undefined, undefined)}
        >Sell</li>
        {
          api.isMobile() && <li 
          className='mainPage'
          onClick={() => setMainPage('pwatst/')}
          >Trade Positions</li>
        }
        {
          api.isMobile() && <li 
            className='mainPage'
            onClick={() => setMainPage('pwatst/traderPrice')}
          >Trade Prices</li>
        }
        {
          activePosition &&
          <li>Pair: {activePosition.position.pair}</li>
        }
      </ul>
    </div>
  )
}

export default Toolbar;