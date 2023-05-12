

export interface TraderDesktopCommands {
  buy: (pair?: string, broker?: string, price?: number) => void;
  sell: (pair?: string, broker?: string, price?: number) => void;
  setMainPage: (page: 'pwatst/' | 'pwatst/traderPrice') => void;
  close: (component: string, instance: string) => void;
}