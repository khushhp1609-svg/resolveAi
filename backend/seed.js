require("dotenv").config();

const mongoose = require("mongoose");

const Transaction = require("./models/Transaction");
const Order = require("./models/Order");
const Event = require("./models/Event");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await Transaction.deleteMany({});
    await Order.deleteMany({});
    await Event.deleteMany({});

    await Transaction.create({
      transactionId: "TXN1001",
      merchantId: "MERCHANT001",
      customerId: "CUSTOMER001",
      amount: 5000,
      paymentMethod: "UPI",
      status: "SUCCESS",
    });

    await Order.create({
      orderId: "ORD1001",
      transactionId: "TXN1001",
      merchantId: "MERCHANT001",
      amount: 5000,
      status: "PENDING",
    });

    await Event.create({
      eventId: "EVT1001",
      transactionId: "TXN1001",
      eventType: "PAYMENT_SUCCESS",
      status: "FAILED",
      metadata: {
        reason: "Merchant endpoint timeout",
      },
    });

    console.log("Mock payment data created successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();