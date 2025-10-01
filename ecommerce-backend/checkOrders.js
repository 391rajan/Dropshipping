const mongoose = require("mongoose");
const config = require("./config");
const Order = require("./models/Order");

const checkOrders = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected");

    const orders = await Order.find({});
    console.log("Orders:", orders);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

checkOrders();