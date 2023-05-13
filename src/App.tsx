import React from 'react';
import { TraderDesktopCommands } from './contracts/TraderDesktopCommands';
import EnterTrade, { EnterTradeProperties } from './elemements/EnterTrade';
import MarketDepth from './elemements/MarketDepth';
import Portfolio from './elemements/Portfolio';
import PriceMovement from './elemements/PriceMovement';
import TraderMobile from './elemements/TraderMobile';
import Toolbar from './elemements/Toolbar';
import Trades from './elemements/Trades';
import TitleBar from './elemements/TitleBar';
import TraderPrice from './elemements/TradePrice';
import UniversalApp, { Component, RouteApi, WindowApi, AppLayout, AppRoute } from 'pwa-synergy-api'
import './App.css';

const components: Component<TraderDesktopCommands>[] = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    content: () => <Portfolio/>,
    group: 'dockableWindow'
  },
  {
    id: 'marketDepth',
    title: 'Market Depth',
    content: ({commands}) => <MarketDepth {...commands!}/>,
    group: 'lockedTab'
  },
  {
    id: 'priceMovement',
    title: 'Price Movement',
    content: () => <PriceMovement/>,
    group: 'dockableWindow'
  },
  {
    id: 'trades',
    title: 'Trades',
    content: () => <Trades/>,
    group: 'dockableWindow'
  },
  {
    id: 'enterTrade',
    title: 'Enter Trade',
    content: ({instanceId, props, commands}) => <EnterTrade instanceId={instanceId} {...(props as EnterTradeProperties)} close={(commands!).close}/>,
    group: 'onlyWindow',
    closable: true
  },
  {
    id: 'traderMobile',
    title: "Trader Mobile",
    content: ({commands}) => <TraderMobile {...commands!}/>
  },
  {
    id: 'traderPrice',
    title: "Trader Price",
    content: ({commands}) => <TraderPrice {...commands!}/>
  }
];

const mobileCommands = (routeApi: RouteApi): TraderDesktopCommands => {
  return {
    buy: (pair?: string, broker?: string, price?: number) => {
      routeApi.navigate(
        'pwatst/enterTrade', 
        {
          buySell: 'BUY',
          pair,
          broker,
          price
        }
      );
    },
    sell: (pair?: string, broker?: string, price?: number) => {
      routeApi.navigate(
        'pwatst/enterTrade', 
        {
          buySell: 'SELL',
          pair,
          broker,
          price
        }
      );
    },
    setMainPage: (page: 'pwatst/' | 'pwatst/traderPrice') => routeApi.navigate(page),
    close: () => routeApi.back()
  }
}

const desktopCommands = (desktopApi: WindowApi): TraderDesktopCommands => {
  return {
    buy: (pair?: string, broker?: string, price?: number) => {
      desktopApi.openWindow(
        'enterTrade', 
        {
          buySell: 'BUY',
          pair,
          price,
          broker
        },
        'Custom',
        {
          height: 290,
          width: 300
        }
      ); 
    },
    sell: (pair?: string, broker?: string, price?: number) => {
      desktopApi.openWindow(
        'enterTrade', 
        {
          buySell: 'SELL',
          pair,
          price,
          broker
        },
        'Custom',
        {
          height: 290,
          width: 300
        }
      );
    },
    setMainPage: (page: 'pwatst/' | 'pwatst/traderPrice') => {},
    close: (component: string, instance: string) => desktopApi.closeComponent(component, instance)
  }
}

const desktopLayout: AppLayout = {
  panels: {
    orientation: 'Vertical',
    children: [
      {
        id: 'main',
        size: 600,
        components: ['portfolio']
      },
      {
        orientation: 'Horizontal',
        children: [
          {
            id: 'sub1',
            components: ['marketDepth'],
          },
          {
            id: 'sub2',
            components: ['priceMovement'],
          }
          ,
          {
            id: 'sub3',
            components: ['trades'],
          }
        ]
      },
    ]
  },
  componentGroups: [
    {
      id: 'onlyWindow',
      floatable: 'singleTab',
      newWindow: true,
      disableDock: true,
      preferredFloatHeight: [275,275],
      preferredFloatWidth: [352,352]
    },
    {
      id: 'dockableWindow',
      floatable: true,
      newWindow: true,
      maximizable: true
    },
    {
      id: 'lockedTab',
      floatable: false,
      newWindow: false,
      maximizable: false,
      tabLocked: true
    }
  ]
}

const routes: AppRoute[] = [
  {
    index: true,
    component: 'traderMobile'
  },
  {
    path: "pwatst/",
    component: 'traderMobile'
  },
  {
    path: "pwatst/traderPrice",
    component: 'traderPrice'
  },
  {
    path: "pwatst/enterTrade",
    component: 'enterTrade'
  },
]

const App = () => {
  return (
    <div className='App'>
      <UniversalApp<TraderDesktopCommands>
        appName='Universal Trader Desktop'
        components={components}
        titleBar={() => <TitleBar/>}
        toolBar={(commands: TraderDesktopCommands) => <Toolbar {...commands}/>}
        desktopApp={{
          type: 'Window',
          commands: desktopCommands,
          layout: desktopLayout
        }}
        mobileApp={{
          type: 'Route',
          commands: mobileCommands,
          routes          
        }}
      />
    </div>
  );
}

export default App;
