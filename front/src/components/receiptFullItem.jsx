import PropTypes from "prop-types";

function ReceiptFullItem({ itemID, cost, amount, deleteItem }) {
  return (
    <div className="receipt-full-item-container">
      <input name="cost" placeholder="Cost" defaultValue={cost} />
      <input name="amount" placeholder="Amount" defaultValue={amount} />
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
};

export default ReceiptFullItem;
