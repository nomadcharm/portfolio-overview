import { useState, useRef, useEffect, useMemo } from "react";
import { IAsset, IPriceInfo, ITickerInfo } from "../types/types";
import { calculatePortfolioShare } from "../utils/calculatePortfolioShare";
import { useLocalStorage } from "./useLocalStorage";
import { useOutsideClick } from "./useOutsideClick";
import { useGet24hrTickerQuery, useGetCurrentPricesQuery, useGetExchangeInfoQuery } from "../redux/features/binanceSlice";
import { useWebSocketPrices } from "./useWebsocketPrices";

export const useModalForm = (onClose: () => void) => {
  const { data: exchangeData, isLoading: isLoadingExchange } = useGetExchangeInfoQuery(null);
  const { data: initialPricesData, isLoading: isLoadingPrices } = useGetCurrentPricesQuery(null);
  const { data: tickerData, isLoading: isLoadingTicker } = useGet24hrTickerQuery(null);
  
  const [pricesData, setPricesData] = useState<IPriceInfo[] | []>([]);
  const [initialPrices, setInitialPrices] = useState<IPriceInfo[] | []>([]);
  useWebSocketPrices(setPricesData);

  useEffect(() => {
    if (initialPricesData) {
      const validPrices = initialPricesData.map((price: { symbol: string; price: string }) => {
        const parsedPrice = parseFloat(price.price);
        return {
          symbol: price.symbol,
          price: isNaN(parsedPrice) ? null : parsedPrice
        };
      });
      setInitialPrices(validPrices);
    }
  }, [initialPricesData]);

  const [portfolio, setPortfolio] = useLocalStorage<IAsset[]>("currencies", []);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const isLoading = isLoadingExchange || isLoadingPrices || isLoadingTicker;
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isQuantityValid = quantity < 0;

  useOutsideClick(modalRef, onClose);

  useEffect(() => {
    if (exchangeData) {
      const uniqueCurrencies = new Set<string>();
      exchangeData.symbols.forEach((symbol: { baseAsset: string }) => {
        uniqueCurrencies.add(symbol.baseAsset);
      });
      setCurrencies(Array.from(uniqueCurrencies));
    }
  }, [exchangeData]);

  const filteredCurrencies = useMemo(() => 
    currencies.filter(currency => 
      currency.toLowerCase().includes(searchQuery.toLowerCase())
    ), [currencies, searchQuery]);

  const handleCurrencyChoice = (currency: string) => {
    const priceInfo = [...pricesData, ...initialPrices].find((price: IPriceInfo) => price.symbol === `${currency}USDT`);
    setSelectedCurrency(currency);
    setCurrentPrice(priceInfo && priceInfo.price !== null ? priceInfo.price.toString() : "");
  };

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const resetModalForm = () => {
    setSelectedCurrency(null);
    setCurrentPrice(null);
    setQuantity(1);
  };

  const handleAdd = () => {
    if (selectedCurrency && currentPrice) {
      const priceChangeInfo = tickerData?.find((ticker: ITickerInfo) => ticker.symbol === `${selectedCurrency}USDT`);
      const priceChangePercent = priceChangeInfo?.priceChangePercent;

      const currencyData: IAsset = {
        id: Math.random().toString(36).substring(2, 10),
        currency: selectedCurrency,
        price: parseFloat(currentPrice),
        totalAmount: parseFloat(currentPrice) * quantity,
        quantity: quantity,
        priceChangePercent: priceChangePercent,
        portfolioPercentage: ""
      };

      const updatedPortfolio = [...portfolio, currencyData];

      setPortfolio(calculatePortfolioShare(updatedPortfolio));
      resetModalForm();
      onClose();
    }
  };

  const handleCancel = () => {
    resetModalForm();
  };

  return {
    isLoading,
    isQuantityValid,
    filteredCurrencies,
    pricesData: [...pricesData, ...initialPrices],
    tickerData,
    modalRef,
    quantity,
    currentPrice,
    setQuantity,
    selectedCurrency,
    handleCurrencyChoice,
    searchQuery,
    handleSearchQuery,
    handleAdd,
    handleCancel,
  };
}
