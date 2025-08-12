import React from "react";

function TrackOrder() {
  return (
    <main className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-8">Track Your Order</h1>
        <p className="text-accent text-lg mb-8">Enter your order ID to see the status of your shipment.</p>
        {/* Add order tracking form here */}
      </div>
    </main>
  );
}

export default TrackOrder;
