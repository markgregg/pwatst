

export interface TraderDesktopCommands {
  buy: (pair?: string, broker?: string, price?: number) => void;
  sell: (pair?: string, broker?: string, price?: number) => void;
  setMainPage: (page: '/' | 'traderPrice') => void;
  close: (component: string, instance: string) => void;
}