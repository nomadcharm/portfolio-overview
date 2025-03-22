import { FC, useCallback } from "react";
import { ReactSVG } from "react-svg";
import { useModalForm } from "../../hooks/useModalForm";
import { IPriceInfo, ITickerInfo } from "../../types/types";
import { setToFixed } from "../../utils/setToFixed";
import Loader from "../Loader/Loader";
import closeIcon from "../../assets/icon-close.svg";
import "./modalForm.scss";

interface ModalFormProps {
  onClose: () => void
}

const ModalForm: FC<ModalFormProps> = ({ onClose }) => {
  const {
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
  } = useModalForm(onClose);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  }, [setQuantity]);

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

          {isLoading && <Loader />}

          <ul className="modal__currencies currency-list">
            {filteredCurrencies.map((currency) => {
              const priceInfo = pricesData?.find((price: IPriceInfo) => price.symbol === `${currency}USDT`);
              const tickerInfo = tickerData?.find((ticker: ITickerInfo) => ticker.symbol === `${currency}USDT`);
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
                onChange={handleQuantityChange}
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