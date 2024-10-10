import PropTypes from "prop-types";
import { useState } from "react";
import ReceiptFullItem from "./receiptFullItem";
import { newItem } from "../objects";

function ReceiptFull({
  id,
  isUserPurchase,
  receiptCost,
  personID,
  persons,
  currentItems,
  // placeID,
  addReceipt,
  editReceipt,
}) {
  let isAddReceipt;
  if (id == 0) {
    isAddReceipt = true;
    isUserPurchase = false;
    receiptCost = 0;
    personID = 0;
    // placeID = 0;
    currentItems = [];
  }
  let [items, setItems] = useState(currentItems);
  function addItem() {
    let nextID = items.length > 0 ? items[items.length - 1].ID + 1 : 0;
    setItems(items.concat(newItem(nextID, 0, 0.5)));
  }
  function deleteItem(itemID) {
    let newItems = items.slice();
    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].ID == itemID) {
        newItems.splice(i, 1);
        break;
      }
    }
    setItems(newItems);
  }
  // function editItem(ind, item) {
  //   let newItems = items.slice();
  //   newItems[ind] = item;
  //   setItems(newItems);
  // }

  return (
    <div className="receipt-container">
      <div className="receipt-row">
        {isAddReceipt && <h3>Add receipt</h3>}
        {!isAddReceipt && <h3>Edit receipt</h3>}
      </div>
      <div className="receipt-row">
        <p>Is user purchase:</p>
        <input
          name="isUserPurchase"
          type="checkbox"
          placeholder="isUserPurchase"
          defaultValue={false}
        />
      </div>
      <div className="receipt-row">
        <input
          name="receiptCost"
          placeholder="Receipt cost"
          defaultValue={receiptCost}
        />
        <input name="personID" placeholder="PersonID" defaultValue={personID} />
      </div>
      <div className="receipt-column">
        {items.map((item) => (
          <ReceiptFullItem
            key={item.ID}
            itemID={item.ID}
            cost={item.cost}
            amount={item.amount}
            deleteItem={deleteItem}
          />
        ))}
        <div className="receipt-full-items-controls">
          <button
            onClick={() => {
              addItem();
            }}
          >
            Add item
          </button>
        </div>
      </div>
      <div className="receipt-controls">
        {isAddReceipt && (
          <button
            onClick={() => {
              // Save to backend
              addReceipt(currentItems, isUserPurchase, receiptCost);
            }}
          >
            Add Receipt
          </button>
        )}
        {!isAddReceipt && (
          <button
            onClick={() => {
              // Save to backend
              editReceipt(
                currentItems,
                isUserPurchase,
                receiptCost,
                persons[personID].name,
              );
            }}
          >
            Edit Receipt
          </button>
        )}
      </div>
    </div>
  );
}

ReceiptFull.propTypes = {
  id: PropTypes.number,
  isUserPurchase: PropTypes.bool,
  placeID: PropTypes.number,
  personID: PropTypes.number,
  receiptCost: PropTypes.number,
  persons: PropTypes.arrayOf(PropTypes.object),
  personDebt: PropTypes.number,
  addReceipt: PropTypes.func,
  editReceipt: PropTypes.func,
  currentItems: PropTypes.arrayOf(PropTypes.object),
};

export default ReceiptFull;
