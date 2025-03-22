import { useState } from "react";
import AssetList from "./components/AssetList/AssetList"
import Header from "./components/Header/Header"
import { useWebSocketPrices } from "./redux/features/binanceSlice";
import { IPriceInfo } from "./types/types";


function App() {

  const [pricesData, setPricesData] = useState<IPriceInfo[]>([]);
  useWebSocketPrices(setPricesData); 

  return (
    <>
      <Header />
      <AssetList updatedPrices={pricesData} />
    </>
  )
}

export default App
