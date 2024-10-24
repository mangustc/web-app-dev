import { useState } from "react";
import Receipt from "../components/receipt";
import { newReceipt } from "../objects";
import { getReceipts } from "../requests";
import { useLoaderData } from "react-router-dom";

export const loader = async function () {
  const receiptList = await getReceipts();
  return { receiptList };
};

export const Receipts = function () {
  const { receiptList } = useLoaderData();
  const [receipts, setReceipts] = useState(receiptList);
  let deleteReceipt = function (id) {
    let newReceipts = receipts.slice();
    for (let i = 0; i < newReceipts.length; i++) {
      if (newReceipts[i].id == id) {
        newReceipts.splice(i, 1);
        break;
      }
    }
    setReceipts(newReceipts);
  };
  let editReceipt = function (receipt) {
    let newReceipts = receipts.slice();
    for (let i = 0; i < newReceipts.length; i++) {
      if (newReceipts[i].id == receipt.id) {
        newReceipts[i] = receipt;
        break;
      }
    }
    setReceipts(newReceipts);
  };
  let addReceipt = function (receipt) {
    let newReceipts = receipts.slice();
    newReceipts.push(receipt);
    setReceipts(newReceipts);
  };

  return (
    <>
      <h3>Receipt table</h3>
      <div className="receipt-table-controls">
        <button
          onClick={() => {
            addReceipt(
              newReceipt(
                receipts.length > 0 ? receipts[receipts.length - 1].id + 1 : 0,
                "transport",
                "alisa",
                2900,
                1450,
              ),
            );
          }}
        >
          Add receipt
        </button>
      </div>
      <div className="receipt-table">
        {receipts
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
              editReceipt={editReceipt}
              deleteReceipt={deleteReceipt}
            />
          ))}
      </div>
    </>
  );
};
