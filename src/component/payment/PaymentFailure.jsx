import { useParams } from "react-router-dom";

/*
PaymentFailure Page

Purpose:
Shows message when Razorpay payment fails.

Flow:
PaymentPage → Razorpay failure → redirect here
*/

const PaymentFailure = () => {

  // read booking reference from URL
  const { bookingReference } = useParams();

  return (

    <div className="payment-failure">

      <h2>Payment Failed ❌</h2>

      {/* show failure info */}
      <p>
        Your payment for booking reference{" "}
        <strong>
          {bookingReference || "N/A"}
        </strong>{" "}
        could not be completed.
      </p>

      {/* helpful retry message */}
      <p>
        Please try again or use a different payment method.
      </p>

    </div>

  );
};

export default PaymentFailure;
