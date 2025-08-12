import React from "react";

function Wishlist() {
  return (
    <main className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-8">Your Wishlist</h1>
        <p className="text-accent text-lg mb-8">Save your favorite products for later!</p>
        {/* Add wishlist content here */}
      </div>
    </main>
  );
}

export default Wishlist;
