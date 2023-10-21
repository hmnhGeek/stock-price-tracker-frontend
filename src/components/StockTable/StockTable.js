import Table from 'react-bootstrap/Table';
import './StockTable.css';

const numberFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const StockTable = props => {
  return (
    <Table className='stock-table' striped bordered hover variant="light">
      <thead>
        <tr>
          <th>Stock Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.stockName}</td>
          <td>{numberFormatter.format(props.stockPrice)}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default StockTable;