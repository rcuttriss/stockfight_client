import DataGridStock from "./DataGrid";
import BuyArea from "./BuyArea";
import CashStackDisplay from "./CashStackDisplay";

function Details() {
  return (
    <div className="Details">
      <CashStackDisplay></CashStackDisplay>
      <DataGridStock></DataGridStock>
      <BuyArea></BuyArea>
    </div>
  );
}

export default Details;
