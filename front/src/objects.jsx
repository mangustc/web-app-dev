export const newReceiptFromReceiptFull = function (receiptFull) {
  let id = receiptFull.id;
  let place = getPlaceName(receiptFull.placeID);
  let personName = `${receiptFull.personID}`;

  let personDebt = 0,
    userSpent = 0;
  if (receiptFull.isUserPurchase) {
    for (let j = 0; j < receiptFull.items.length; j++) {
      personDebt += receiptFull.items[j].cost * receiptFull.items[j].amount;
    }
    userSpent = receiptFull.receiptCost - personDebt;
  } else {
    for (let j = 0; j < receiptFull.items.length; j++) {
      userSpent += receiptFull.items[j].cost * receiptFull.items[j].amount;
    }
    personDebt = -userSpent;
  }

  return newReceipt(id, place, personName, personDebt, userSpent);
};

export const newReceiptFromJSON = function (receiptFull) {
  let id = receiptFull.id;
  let place = getPlaceName(receiptFull.place_id);
  let personName = `${receiptFull.person_id}`;

  let personDebt = 0,
    userSpent = 0;
  if (receiptFull.is_user_purchase) {
    for (let j = 0; j < receiptFull.items.length; j++) {
      personDebt += receiptFull.items[j].cost * receiptFull.items[j].amount;
    }
    userSpent = receiptFull.receipt_cost - personDebt;
  } else {
    for (let j = 0; j < receiptFull.items.length; j++) {
      userSpent += receiptFull.items[j].cost * receiptFull.items[j].amount;
    }
    personDebt = -userSpent;
  }

  return newReceipt(id, place, personName, personDebt, userSpent);
};

export const newReceipt = function (
  id,
  place,
  personName,
  personDebt,
  userSpent,
) {
  return {
    id: Number(id),
    place: String(place),
    personName: String(personName),
    personDebt: Number(personDebt),
    userSpent: Number(userSpent),
  };
};

export const newReceiptFullFromJSON = function (obj) {
  return newReceiptFull(
    obj.id,
    obj.receipt_cost,
    obj.person_id,
    obj.is_user_purchase,
    obj.place_id,
    obj.items,
    obj.creation_date,
  );
};

export const newReceiptFull = function (
  id,
  receipt_cost,
  person_id,
  is_user_purchase,
  place_id,
  items,
  creation_date,
) {
  let newItems = [];
  for (let i = 0; i < items.length; i++) {
    newItems.push(newItem(items[i].id, items[i].cost, items[i].amount));
  }
  return {
    id: Number(id),
    receiptCost: Number(receipt_cost),
    personID: Number(person_id),
    items: newItems,
    creationDate: String(creation_date),
    isUserPurchase: Boolean(is_user_purchase),
    placeID: Number(place_id),
  };
};

export const newItem = function (ID, cost, amount) {
  return {
    ID: Number(ID),
    cost: Number(cost),
    amount: Number(amount),
  };
};

export const getPlaceName = function (placeID) {
  switch (placeID) {
    case 1:
      return "place1";
    default:
      return "default";
  }
};

export const newPersonFromJSON = function (json) {
  return {
    ID: Number(json.id),
    personName: String(json.person_name),
  };
};

export const newPerson = function (ID, personName) {
  return {
    ID: Number(ID),
    personName: String(personName),
  };
};
