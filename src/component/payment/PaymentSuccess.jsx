import { useParams } from "react-router-dom";

/*
PaymentSuccess Page

Purpose:
This page shows confirmation after successful Razorpay payment.

Flow:
PaymentPage → payment success → redirect here
*/

const PaymentSuccess = () => {

  // read booking reference from URL
  const { bookingReference } = useParams();

  return (

    <div className="payment-success">

      <h2>Payment Successful ✅</h2>

      {/* show booking confirmation */}
      <p>
        Your payment for booking reference{" "}
        <strong>
          {bookingReference || "N/A"}
        </strong>{" "}
        was completed successfully.
      </p>

      {/* optional helpful message */}
      <p>
        Thank you for booking with us. Your reservation is confirmed.
      </p>

    </div>

  );
};

export default PaymentSuccess;
