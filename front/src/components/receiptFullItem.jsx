import PropTypes from "prop-types";
import { newItem } from "../objects";
import { useState } from "react";

function ReceiptFullItem({ itemID, cost, amount, deleteItem, updateItem }) {
  const [item, setItem] = useState(newItem(itemID, cost, amount));
  const setCost = function (newCost) {
    let itemChanged = newItem(item.ID, newCost, item.amount);
    setItem(itemChanged);
    updateItem(itemChanged);
  };
  const setAmount = function (newAmount) {
    let itemChanged = newItem(item.ID, item.cost, newAmount);
    setItem(itemChanged);
    updateItem(itemChanged);
  };
  return (
    <div className="receipt-full-item-container">
      <input
        name="cost"
        placeholder="Cost"
        type="number"
        value={item.cost}
        onChange={(e) => setCost(e.target.value)}
      />
      <input
        name="amount"
        placeholder="Amount"
        type="number"
        value={item.amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={() => {
          deleteItem(itemID);
        }}
      >
        Delete
      </button>
    </div>
  );
}

ReceiptFullItem.propTypes = {
  itemID: PropTypes.number,
  cost: PropTypes.number,
  amount: PropTypes.number,
  deleteItem: PropTypes.func,
  updateItem: PropTypes.func,
};

export default ReceiptFullItem;
