import { useParams } from "react-router-dom";

function Payment() {
  const { packageId } = useParams();

  return (
    <div className="container">
      <h2 className="text-center">Payment for Package ID: {packageId}</h2>
      <p className="text-center">Select your payment option:</p>
      <div className="payment-options">
        <div className="payment-option">
          <h3>UPI</h3>
          <button>Pay with UPI</button>
        </div>
        <div className="payment-option">
          <h3>Credit/Debit Card</h3>
          <button>Pay with Card</button>
        </div>
        <div className="payment-option">
          <h3>Net Banking</h3>
          <button>Pay via Net Banking</button>
        </div>
        <div className="payment-option">
          <h3>Cash on Arrival</h3>
          <button>Select COD</button>
        </div>
      </div>
      <p className="text-center"><em>(This is a mock payment page. No actual payment integration.)</em></p>
    </div>
  );
}

export default Payment;