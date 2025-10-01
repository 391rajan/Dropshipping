const sampleProducts = [
  {
    name: "Samsung Galaxy S21",
    description: "Latest Samsung flagship smartphone with 5G capability",
    price: 999.99,
    originalPrice: 1099.99,
    images: [
      "https://example.com/images/galaxy-s21-1.jpg",
      "https://example.com/images/galaxy-s21-2.jpg"
    ],
    category: "68dcf678afde8a1e4528c07e", // Electronics category ID
    brand: "Samsung",
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    tags: ["smartphone", "5G", "android"],
    isActive: true,
    isFeatured: true,
    specifications: {
      "screen": "6.2 inch AMOLED",
      "processor": "Snapdragon 888",
      "ram": "8GB",
      "storage": "128GB"
    }
  },
  {
    name: "Apple MacBook Pro",
    description: "Powerful laptop for professionals",
    price: 1299.99,
    originalPrice: 1499.99,
    images: [
      "https://example.com/images/macbook-pro-1.jpg",
      "https://example.com/images/macbook-pro-2.jpg"
    ],
    category: "68dcf678afde8a1e4528c07e", // Electronics category ID
    brand: "Apple",
    stock: 30,
    rating: 4.8,
    numReviews: 256,
    tags: ["laptop", "macOS", "professional"],
    isActive: true,
    isFeatured: true,
    specifications: {
      "screen": "13.3 inch Retina",
      "processor": "M1 Pro",
      "ram": "16GB",
      "storage": "512GB SSD"
    }
  }
];

module.exports = { sampleProducts };