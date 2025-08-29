// src/components/CheckoutForm.jsx
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message);
      onPaymentFailure(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setError(null);
      onPaymentSuccess(paymentIntent.id);
      // The parent component will handle the rest (e.g., creating the order)
    } else {
        setError('Payment failed with status: ' + paymentIntent.status);
        onPaymentFailure('Payment failed with status: ' + paymentIntent.status);
        setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 border rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <CardElement options={cardElementOptions} />
      </div>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      <button 
        type="submit" 
        disabled={!stripe || processing} 
        className="w-full mt-4 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;
