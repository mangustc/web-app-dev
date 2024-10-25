import { newReceiptFromJSON, newReceiptFullFromJSON } from "./objects";

export const GET_Receipts = async function () {
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
    receiptList.push(newReceiptFromJSON(json[i]));
  }

  return receiptList;
};

export const GET_Receipt = async function (id) {
  let response = await fetch(
    "http://localhost:8000/api/receipt/get_receipt?" +
      new URLSearchParams({
        id: id,
      }),
    {
      method: "GET",
      headers: {},
    },
  );
  let json = await response.json();
  const receipt = newReceiptFullFromJSON(json);

  return receipt;
};

export const DELETE_Receipt = async function (id) {
  let response = await fetch(
    "http://localhost:8000/api/receipt/delete_receipt?" +
      new URLSearchParams({
        id: id,
      }),
    {
      method: "DELETE",
      headers: {},
    },
  );
  let json = await response.json();

  return json;
};

export const POST_CreateReceipt = async function (receiptFull) {
  let newItems = [];
  for (let i = 0; i < receiptFull.items.length; i++) {
    newItems.push({
      name: "nothing",
      cost: receiptFull.items[i].cost,
      amount: receiptFull.items[i].amount,
    });
  }
  const body = {
    user_id: 1,
    receipt_cost: receiptFull.receiptCost,
    person_id: receiptFull.personID,
    is_user_purchase: receiptFull.isUserPurchase,
    place_id: receiptFull.placeID,
    items: newItems,
  };
  let response = await fetch(
    "http://localhost:8000/api/receipt/create_receipt",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  let json = await response.json();

  return json;
};

export const PUT_UpdateReceipt = async function (receiptFull) {
  let newItems = [];
  for (let i = 0; i < receiptFull.items.length; i++) {
    newItems.push({
      name: "nothing",
      cost: receiptFull.items[i].cost,
      amount: receiptFull.items[i].amount,
    });
  }
  const body = {
    id: receiptFull.id,
    receipt: {
      user_id: 1,
      receipt_cost: receiptFull.receiptCost,
      person_id: receiptFull.personID,
      is_user_purchase: receiptFull.isUserPurchase,
      place_id: receiptFull.placeID,
      items: newItems,
    },
  };
  console.log(body);
  let response = await fetch(
    "http://localhost:8000/api/receipt/update_receipt",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  let json = await response.json();

  return json;
};

export const PUT_ChangePhoto = async function (id, data) {
  console.log(data);
  const body = data;
  let response = await fetch(
    `http://localhost:8000/api/user/id/${id}/change_photo`,
    {
      method: "PUT",
      headers: {
        accept: "application/json",
      },
      body: body,
    },
  );
  let json = await response.json();

  return json;
};

export const GET_Photo = async function (id) {
  let response = await fetch(`http://localhost:8000/api/user/id/${id}/photo`);
  let photo = await response.blob();

  return photo;
};
