import { useContext, useState } from "react";
import StockContext from "../../lib/context";

function Details() {
  const { stockData, setStockData } = useContext(StockContext);

  return <div className="Details">{stockData}</div>;
}

export default Details;
