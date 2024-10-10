import { useState } from "react";
import Receipt from "../components/receipt";
import { newReceipt } from "../objects";

export default function Receipts() {
  let test = [
    newReceipt(7, "magazin", "alisa", 100, 200),
    newReceipt(8, "magazin", "alisa", 100, 200),
    newReceipt(9, "magazin", "alisa", 100, 200),
    newReceipt(10, "magazin", "alisa", 100, 200),
    newReceipt(11, "magazin", "alisa", 100, 200),
  ];
  const [receipts, setReceipts] = useState(test);
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

  return (
    <>
      <h3>Receipt table</h3>
      <div className="receipt-table-controls">
        <button>Add receipt</button>
      </div>
      <div className="receipt-table">
        {receipts.map((receipt) => (
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
}
