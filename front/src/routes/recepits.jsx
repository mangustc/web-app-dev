import { useEffect, useState } from "react";
import Receipt from "../components/receipt";
import {
  DELETE_Receipt,
  GET_Receipts,
  POST_CreateReceipt,
  PUT_UpdateReceipt,
} from "../requests";
import ReceiptFull from "../components/receiptFull";
import { newReceiptFromReceiptFull } from "../objects";

export const Receipts = function () {
  const [receipts, setReceipts] = useState(null);
  useEffect(() => {
    GET_Receipts().then((receiptList) => setReceipts(receiptList));
  }, []);
  let deleteReceipt = function (id) {
    DELETE_Receipt(id).then(() => {
      let newReceipts = receipts.slice();
      for (let i = 0; i < newReceipts.length; i++) {
        if (newReceipts[i].id == id) {
          newReceipts.splice(i, 1);
          break;
        }
      }
      setReceipts(newReceipts);
    });
  };

  let [currentReceiptID, setCurrentReceiptID] = useState(0);
  let changeCurrentReceiptID = function (ID) {
    setCurrentReceiptID(ID);
  };
  let editReceipt = function (receiptFull) {
    PUT_UpdateReceipt(receiptFull).then(() => {
      let newReceipts = receipts.slice();
      const receipt = newReceiptFromReceiptFull(receiptFull);
      for (let i = 0; i < newReceipts.length; i++) {
        if (newReceipts[i].id == receipt.id) {
          newReceipts[i] = receipt;
          break;
        }
      }
      setReceipts(newReceipts);
      changeCurrentReceiptID(0);
    });
  };
  let addReceipt = function (receiptFull) {
    POST_CreateReceipt(receiptFull).then(() => {
      let newReceipts = receipts.slice();
      const receipt = newReceiptFromReceiptFull(receiptFull);
      newReceipts.push(receipt);
      setReceipts(newReceipts);
      changeCurrentReceiptID(0);
    });
  };

  return (
    <>
      <h3>Receipt table</h3>
      <div className="receipt-table-controls">
        <button
          onClick={() => {
            changeCurrentReceiptID(0);
          }}
        >
          Return
        </button>
        <ReceiptFull
          key={currentReceiptID}
          id={currentReceiptID}
          addReceipt={addReceipt}
          editReceipt={editReceipt}
        />
      </div>
      <div className="receipt-table">
        {receipts
          ? receipts
              .slice()
              .reverse()
              .map((receipt) => (
                <Receipt
                  key={receipt.id * receipt.userSpent * receipt.personDebt}
                  id={receipt.id}
                  place={receipt.place}
                  personName={receipt.personName}
                  personDebt={receipt.personDebt}
                  userSpent={receipt.userSpent}
                  editReceipt={() => {
                    changeCurrentReceiptID(receipt.id);
                  }}
                  deleteReceipt={deleteReceipt}
                />
              ))
          : "Loading..."}
      </div>
    </>
  );
};
