import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PaymentForm from "./PaymentForm";
import ApiService from "../../service/ApiService";

/*
This page:

1) Calls backend to create Razorpay order
2) Passes orderId to PaymentForm
3) Handles success/failure update
*/

const PaymentPage = () => {

    // read URL params
    const { bookingReference, amount } = useParams();

    // Razorpay order id from backend
    const [orderId, setOrderId] = useState(null);

    // UI states
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const navigate = useNavigate();

    /*
    Step 1:
    Call backend → create Razorpay order
    */
    useEffect(() => {

        const createOrder = async () => {

            try {

                const paymentData = {
                    bookingReference,
                    amount
                };

                console.log("Creating Razorpay order:", paymentData);

                // backend returns Razorpay order id
                const order = await ApiService.proceedForPayment(paymentData);

                setOrderId(order);

            } catch (error) {

                console.log("Order creation failed:", error);

                setError(
                    error.response?.data?.message || error.message
                );
            }
        };

        createOrder();

    }, [bookingReference, amount]);


    // show backend error
    if (error) {
        return <div className="error-message">{error}</div>;
    }


    /*
    Step 2:
    After popup success/failure → update backend booking status
    */
    const handlePaymentStatus = async (
        status,
        transactionId = "",
        failureReason = ""
    ) => {

        try {

            const paymentData = {
                bookingReference,
                amount,
                transactionId,
                success: status === "succeeded",
                failureReason
            };

            await ApiService.updatePayment(paymentData);

            console.log("Payment status updated");

        } catch (error) {

            console.log("Update failed:", error.message);
        }
    };


    /*
    Step 3:
    Render Razorpay form when order is ready
    */
    return (

        <div className="payment-page">

            {orderId && (

                <PaymentForm

                    orderId={orderId}
                    amount={amount}

                    // success callback
                    onPaymentSuccess={async (transactionId) => {

                    setPaymentStatus("succeeded");

                    // WAIT for backend update
                    await handlePaymentStatus(
                        "succeeded",
                        transactionId
                    );

                    // THEN navigate
                    navigate(`/payment-success/${bookingReference}`);
                    }}


                    // failure callback
                    onPaymentError={async (errorMsg) => {

                    setPaymentStatus("failed");

                    await handlePaymentStatus(
                        "failed",
                        "",
                        errorMsg
                    );

                    navigate(`/payment-failed/${bookingReference}`);
                    }}

                />
            )}

            {paymentStatus && (
                <div>
                    Payment Status: {paymentStatus}
                </div>
            )}

        </div>
    );
};

export default PaymentPage;
