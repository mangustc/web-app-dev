export const newReceipt = function (
  id,
  place,
  personName,
  personDebt,
  userSpent,
) {
  return {
    id: id,
    place: place,
    personName: personName,
    personDebt: personDebt,
    userSpent: userSpent,
  };
};

export const newItem = function (ID, cost, amount) {
  return {
    ID: ID,
    cost: cost,
    amount: amount,
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
