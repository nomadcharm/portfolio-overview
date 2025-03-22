import { useState, useRef, useEffect, useMemo } from "react";
import { useGetExchangeInfoQuery, useGetCurrentPricesQuery, useGet24hrTickerQuery } from "../redux/features/binanceSlice";
import { PriceInfo, IAsset, TickerInfo } from "../types/types";
import { calculatePortfolioShare } from "../utils/calculatePortfolioShare";
import { useLocalStorage } from "./useLocalStorage";
import { useOutsideClick } from "./useOutsideClick";

export const useModalForm = (onClose: () => void) => {
  const { data: exchangeData, isLoading: isLoadingExchange } = useGetExchangeInfoQuery(null);
  const { data: pricesData, isLoading: isLoadingPrices } = useGetCurrentPricesQuery(null);
  const { data: tickerData, isLoading: isLoadingTicker } = useGet24hrTickerQuery(null);
  
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
    const priceInfo = pricesData?.find((price: PriceInfo) => price.symbol === `${currency}USDT`);
    setSelectedCurrency(currency);
    setCurrentPrice(priceInfo ? priceInfo.price : "");
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
      const priceChangeInfo = tickerData?.find((ticker: TickerInfo) => ticker.symbol === `${selectedCurrency}USDT`);
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
    pricesData,
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
  }
}