import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ReceiptFullItem from "./receiptFullItem";
import { newItem, newReceiptFull } from "../objects";
import { GET_Receipt } from "../requests";

function ReceiptFull({ id, addReceipt, editReceipt }) {
  let [receipt, setReceipt] = useState(null);
  useEffect(() => {
    if (id == 0) {
      setReceipt(newReceiptFull(0, 1, 0, 0, [], "", true, 1));
      setItems([]);
      setIsUserPurchase(true);
      setReceiptCost(0);
      setPersonID(1);
    } else {
      GET_Receipt(id).then((receiptFull) => {
        setReceipt(receiptFull);
        setItems(receiptFull.items);
        setIsUserPurchase(receiptFull.isUserPurchase);
        setReceiptCost(receiptFull.receiptCost);
        setPersonID(receiptFull.personID);
      });
    }
  }, [id]);

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
  function updateItem(item) {
    let newItems = items.slice();
    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].ID == item.ID) {
        newItems[i] = item;
        break;
      }
    }
    setItems(newItems);
  }

  const [items, setItems] = useState([]);
  const [isUserPurchase, setIsUserPurchase] = useState(true);
  const [receiptCost, setReceiptCost] = useState(0);
  const [personID, setPersonID] = useState(1);

  const getReceiptData = function () {
    const receiptFull = JSON.parse(JSON.stringify(receipt));
    receiptFull.items = items;
    receiptFull.isUserPurchase = isUserPurchase;
    receiptFull.receiptCost = receiptCost;
    receiptFull.personID = personID;
    return receiptFull;
  };

  return (
    <div className="receipt-container">
      {receipt ? (
        <>
          <div className="receipt-row">
            {id == 0 ? <h3>Add receipt</h3> : <h3>Edit receipt</h3>}
          </div>
          <div className="receipt-row">
            <p>Is user purchase:</p>
            <input
              name="isUserPurchase"
              type="checkbox"
              placeholder="isUserPurchase"
              checked={isUserPurchase}
              onChange={(e) => setIsUserPurchase(e.target.checked)}
            />
          </div>
          <div className="receipt-row">
            <input
              name="receiptCost"
              placeholder="Receipt cost"
              type="number"
              value={receiptCost}
              onChange={(e) => setReceiptCost(e.target.value)}
            />
            <input
              name="personID"
              placeholder="PersonID"
              type="number"
              value={personID}
              onChange={(e) => setPersonID(e.target.value)}
            />
          </div>
          <div className="receipt-column">
            {items
              ? items.map((item) => (
                  <ReceiptFullItem
                    key={item.ID}
                    itemID={item.ID}
                    cost={item.cost}
                    amount={item.amount}
                    deleteItem={deleteItem}
                    updateItem={updateItem}
                  />
                ))
              : "Loading..."}
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
            {receipt.id == 0 ? (
              <button
                onClick={() => {
                  addReceipt(getReceiptData());
                }}
              >
                Add Receipt
              </button>
            ) : (
              <button
                onClick={() => {
                  editReceipt(getReceiptData());
                }}
              >
                Edit Receipt
              </button>
            )}
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

ReceiptFull.propTypes = {
  id: PropTypes.number,
  addReceipt: PropTypes.func,
  editReceipt: PropTypes.func,
};

export default ReceiptFull;
