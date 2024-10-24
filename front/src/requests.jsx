import { getPlaceName, newReceipt } from "./objects";

export const getReceipts = async function () {
  let response = await fetch(
    "http://localhost:8000/api/receipt/get_receipts?" +
      new URLSearchParams({
        user_id: 1,
      }),
    {
      method: "GET",
      headers: {},
    },
  );
  let json = await response.json();

  let receiptList = [];
  for (let i = 0; i < json.length; i++) {
    let id = json[i].id;
    let place = getPlaceName(json[i].place_id);
    let personName = `${json[i].person_id}`;

    let personDebt = 0,
      userSpent = 0;
    if (json[i].is_user_purchase) {
      for (let j = 0; j < json[i].items.length; j++) {
        console.log("test");
        personDebt += json[i].items[j].cost * json[i].items[j].amount;
      }
      userSpent = json[i].receipt_cost - personDebt;
    } else {
      for (let j = 0; j < json[i].items.length; j++) {
        userSpent += json[i].items[j].cost * json[i].items[j].amount;
      }
    }

    receiptList.push(newReceipt(id, place, personName, personDebt, userSpent));
  }

  return receiptList;
};
