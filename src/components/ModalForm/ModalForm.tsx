import { FC, useEffect, useMemo, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import { useGetExchangeInfoQuery, useGetCurrentPricesQuery, useGet24hrTickerQuery } from "../../redux/features/binanceSlice";
import { calculatePortfolioShare } from "../../utils/calculatePortfolioShare";
import { IAsset } from "../../types/types";
import { setToFixed } from "../../utils/setToFixed";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import closeIcon from "../../assets/icon-close.svg";
import "./modalForm.scss";

interface PriceInfo {
  symbol: string;
  price: string;
}

interface TickerInfo {
  symbol: string;
  priceChangePercent: string;
}

const ModalForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: exchangeData, isLoading: isLoadingExchange } = useGetExchangeInfoQuery(null);
  const { data: pricesData, isLoading: isLoadingPrices } = useGetCurrentPricesQuery(null);
  const { data: tickerData, isLoading: isLoadingTicker } = useGet24hrTickerQuery(null);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const isLoading = isLoadingExchange || isLoadingPrices || isLoadingTicker;
  const modalRef = useRef(null);
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

  const [portfolio, setPortfolio] = useLocalStorage<IAsset[]>("currencies", []);
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

      setSelectedCurrency(null);
      setCurrentPrice(null);
      setQuantity(0);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedCurrency(null);
    setCurrentPrice(null);
    setQuantity(1);
  };

  return (
    <div className="modal">
      <div className="modal__inner" ref={modalRef}>
        <div className="modal__content">
          <div className="modal__actions">
            <h3 className="modal__title">Доступные валюты</h3>
            <button className="modal__close-btn" onClick={onClose}>
              <ReactSVG src={closeIcon} />
            </button>
          </div>
          <div>
            <input
              className="modal__search"
              type="text"
              placeholder="Найти валюту"
              value={searchQuery}
              onChange={(e) => handleSearchQuery(e)}
            />
          </div>

          {isLoading && <p>Загрузка...</p>}

          <ul className="modal__currencies currency-list">
            {filteredCurrencies.map((currency) => {
              const priceInfo = pricesData?.find((price: PriceInfo) => price.symbol === `${currency}USDT`);
              const tickerInfo = tickerData?.find((ticker: TickerInfo) => ticker.symbol === `${currency}USDT`);
              const currentPrice = priceInfo ? priceInfo.price : 'N/A';
              const percentChange = tickerInfo ? tickerInfo.priceChangePercent : 'N/A';

              if (currentPrice !== 'N/A' || percentChange !== 'N/A') {
                return (
                  <li className="currency-list__item" key={currency} onClick={() => handleCurrencyChoice(currency)}>
                    <p className="currency-list__data">
                      <span>{currency}</span>
                      <span>${setToFixed(currentPrice, 2)}</span>
                      <span>
                        {percentChange < 0 ? (
                          <span style={{ color: "var(--clr-persimmon)" }}>{`${setToFixed(percentChange, 2)}%`}</span>
                        ) : (
                          <span style={{ color: "var(--clr-algae-green" }}>{`+${setToFixed(percentChange, 2)}%`}</span>
                        )}
                      </span>
                    </p>
                  </li>
                );
              }
              return null;
            })}
          </ul>

          {selectedCurrency && (
            <div className="modal__selected-currency">
              <h4 className="modal__selected-title">Выбранная валюта: {selectedCurrency}</h4>
              <p className="modal__selected-current">Текущий курс: {currentPrice}</p>
              <input
                className="modal__selected-quantity"
                type="number"
                value={quantity !== null ? quantity : 0}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Quantity"
              />
              <div className="modal__selected-btn">
                <button
                  className="modal__selected-add"
                  onClick={handleAdd}
                  disabled={isQuantityValid}
                >Добавить</button>
                <button
                  className="modal__selected-cancel"
                  onClick={handleCancel}
                >Отменить</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ModalForm;