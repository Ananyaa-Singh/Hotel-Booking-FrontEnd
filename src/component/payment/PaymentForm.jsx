import { useState } from "react";

/*
This component replaces Stripe card form with Razorpay popup checkout.

Props expected:
orderId → backend created Razorpay order id
amount → payment amount
onPaymentSuccess → callback after payment success
onPaymentError → callback after payment failure
*/

const PaymentForm = ({ orderId, amount, onPaymentSuccess, onPaymentError }) => {

    // UI states (same idea as Stripe version)
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);

    const handlePayment = () => {

        if (processing) return;

        setProcessing(true);

        // Razorpay checkout configuration
        const options = {

            key: process.env.razorpay_key, // replace with your Razorpay key

            amount: amount * 100, // Razorpay uses paise (₹1 = 100 paise)

            currency: "INR",

            name: "Hotel Booking",

            description: "Room Booking Payment",

            order_id: orderId,

            // SUCCESS callback
            handler: function (response) {

                console.log("Payment success:", response);

                setSucceeded(true);
                setProcessing(false);

                // send payment id to parent
                onPaymentSuccess(response.razorpay_payment_id);
            },

            // FAILURE callback
            modal: {
                ondismiss: function () {

                    console.log("Payment cancelled");

                    setProcessing(false);
                    setError("Payment cancelled");

                    onPaymentError("Payment cancelled");
                }
            }
        };

        try {

            // open Razorpay popup
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {

            console.log("Payment error:", err);

            setProcessing(false);
            setError("Payment failed");

            onPaymentError("Payment failed");
        }
    };

    return (
        <div className="payment-form">

            <h3>Complete Your Payment</h3>

            <div className="amount-display">
                <strong>Amount to Pay: ₹{parseFloat(amount).toFixed(2)}</strong>
            </div>

            {/* Payment button */}
            <button
                className="payment-button"
                disabled={processing}
                onClick={handlePayment}
            >
                {processing ? "Processing..." : "Pay Now"}
            </button>

            {/* error UI */}
            {error && <p className="error-message">{error}</p>}

            {/* success UI */}
            {succeeded && (
                <p className="success-message">
                    Payment Successful! Thank you for your booking.
                </p>
            )}

        </div>
    );
};

export default PaymentForm;
