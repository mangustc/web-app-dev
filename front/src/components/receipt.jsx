import PropTypes from "prop-types";

function Receipt({
  id,
  place,
  personName,
  userSpent,
  personDebt,
  editReceipt,
  deleteReceipt,
}) {
  let personDebtStr = personDebt > 0 ? `+${personDebt}` : personDebt;
  return (
    <div className="receipt-container">
      <div className="receipt-row">
        <p>{id}</p>
        <p>{place}</p>
      </div>
      <div className="receipt-column">
        <div className="receipt-row">
          <p>{`Spent: ${userSpent}`}</p>
          <p>{`${personName}'s debt: ${personDebtStr}`}</p>
        </div>
        <div className="receipt-controls">
          <button
            onClick={() => {
              editReceipt({
                id: id,
                place: "magazin",
                personName: "alisa",
                personDebt: 1000,
                userSpent: 200,
              });
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              deleteReceipt(id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

Receipt.propTypes = {
  id: PropTypes.number,
  place: PropTypes.string,
  personName: PropTypes.string,
  userSpent: PropTypes.number,
  personDebt: PropTypes.number,
  editReceipt: PropTypes.func,
  deleteReceipt: PropTypes.func,
};

export default Receipt;
