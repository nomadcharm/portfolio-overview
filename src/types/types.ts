export interface IAsset {
  id: string,
  currency: string,
  quantity: number,
  price: number,
  totalAmount: number,
  priceChangePercent: string,
  portfolioPercentage: string
}

export interface IPriceInfo {
  symbol: string;
  price: string;
}

export interface ITickerInfo {
  symbol: string;
  priceChangePercent: string;
}