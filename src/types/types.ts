export interface IAsset {
  id: string,
  currency: string,
  quantity: number,
  price: number,
  totalAmount: number,
  priceChangePercent: string,
  portfolioPercentage: string
}

export interface PriceInfo {
  symbol: string;
  price: string;
}

export interface TickerInfo {
  symbol: string;
  priceChangePercent: string;
}