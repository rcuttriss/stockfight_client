import { useContext, useState } from "react";
import StockContext from "../../lib/context";

function Details() {
  const { btcData, setBtcData, ethData, setEthData, mkrData, setMkrData } =
    useContext(StockContext);

  return <div className="Details">{}</div>;
}

export default Details;
