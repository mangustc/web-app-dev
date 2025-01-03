import { BACKEND_URL } from "./constants";
import {
  newPersonFromJSON,
  newReceiptFromJSON,
  newReceiptFullFromJSON,
} from "./objects";

export const GET_Receipts = async function () {
  let response = await fetch(BACKEND_URL + "/receipt/get_receipts", {
    method: "GET",
    headers: {},
    credentials: "include",
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  let receiptList = [];
  for (let i = 0; i < json.length; i++) {
    receiptList.push(newReceiptFromJSON(json[i]));
  }

  return receiptList;
};

export const GET_Receipt = async function (id) {
  let response = await fetch(
    BACKEND_URL +
      "/receipt/get_receipt?" +
      new URLSearchParams({
        id: id,
      }),
    {
      method: "GET",
      headers: {},
      credentials: "include",
    },
  );
  let json = await response.json();
  const receipt = newReceiptFullFromJSON(json);
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return receipt;
};

export const DELETE_Receipt = async function (id) {
  let response = await fetch(
    BACKEND_URL +
      "/receipt/delete_receipt?" +
      new URLSearchParams({
        id: id,
      }),
    {
      method: "DELETE",
      headers: {},
      credentials: "include",
    },
  );
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

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
    receipt_cost: receiptFull.receiptCost,
    person_id: receiptFull.personID,
    is_user_purchase: receiptFull.isUserPurchase,
    place_id: receiptFull.placeID,
    items: newItems,
  };
  let response = await fetch(BACKEND_URL + "/receipt/create_receipt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

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
      receipt_cost: receiptFull.receiptCost,
      person_id: receiptFull.personID,
      is_user_purchase: receiptFull.isUserPurchase,
      place_id: receiptFull.placeID,
      items: newItems,
    },
  };
  let response = await fetch(BACKEND_URL + "/receipt/update_receipt", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return json;
};

export const PUT_ChangePhoto = async function (data) {
  const body = data;
  let response = await fetch(BACKEND_URL + "/user/id/1/change_photo", {
    method: "PUT",
    headers: {
      accept: "application/json",
    },
    body: body,
    credentials: "include",
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return json;
};

export const GET_Photo = async function (id) {
  let response = await fetch(BACKEND_URL + `/user/id/${id}/photo`);
  let photo = await response.blob();

  return photo;
};

export const POST_Register = async function (email, password, rePassword) {
  const body = {
    email: email,
    password: password,
    re_password: rePassword,
  };
  let response = await fetch(BACKEND_URL + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return json;
};

export const PUT_Login = async function (email, password) {
  const body = {
    email: email,
    password: password,
  };
  let response = await fetch(BACKEND_URL + "/auth/login", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return json;
};

export const PUT_Logout = async function () {
  const body = {};
  let response = await fetch(BACKEND_URL + "/auth/logout", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return json;
};

export const GET_GetLoggedUser = async function () {
  let response = await fetch(BACKEND_URL + "/auth/get_logged_user", {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    credentials: "include",
  });
  let json = await response.json();
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return json;
};

export const POST_CreatePerson = async function (personName) {
  const body = {
    person_name: personName,
  };
  let response = await fetch(BACKEND_URL + "/receipt/create_person", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  let json = await response.json();
  let person = newPersonFromJSON(json);
  let status = response.status;
  if (status >= 400) throw new Error("Unsuccessful");

  return person;
};
