import StockContext from "../../lib/context";
import { useContext } from "react";

function CashStackDisplay() {
  const { cashStack } = useContext(StockContext);

  return (
    <div className="cashStackDisplay">Current Cash: {cashStack.toFixed(2)}</div>
  );
}

export default CashStackDisplay;
