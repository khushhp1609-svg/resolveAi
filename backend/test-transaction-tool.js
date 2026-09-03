require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { getTransaction } = require("./tools/transactionTool");

async function test() {
  try {
    await connectDB();

    const result = await getTransaction("TXN1001");

    console.log("Transaction tool result:");
    console.log(JSON.stringify(result, null, 2));

    await mongoose.connection.close();
  } catch (error) {
    console.error("Test failed:");
    console.error(error.message);
  }
}

test();