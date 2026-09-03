require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const result = await model.generateContent(
      "Say hello to ResolveAI in one short sentence."
    );

    const response = await result.response;

    console.log("Gemini connection successful!");
    console.log(response.text());
  } catch (error) {
    console.error("Gemini connection failed:");
    console.error(error.message);
  }
}

testGemini();