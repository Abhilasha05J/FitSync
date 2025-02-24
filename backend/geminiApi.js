// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.GEMINI_API_KEY; 
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash-exp",
//   systemInstruction: "You are a healthcare assistant. Respond to user inputs dynamically.",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// // Function to send a message and get a response
// export async function sendMessageToGemini(input) {
//   try {
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [],
//     });

//     const result = await chatSession.sendMessage(input);
//     return result.response.text(); 
//   } catch (error) {
//     console.error("Error interacting with Gemini API:", error);
//     throw new Error("Unable to process the request.");
//   }
// }






import { GoogleGenerativeAI } from "@google/generative-ai";

// Set up Gemini API key and model configuration
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: `
    You are a healthcare assistant chatbot. Answer only health-related queries. If a query is unrelated to health, politely decline to answer.
    - If the user shares symptoms, suggest possible causes and recommend consulting a doctor.
    - If health metrics (e.g., steps, HRV, sleep) are shared, analyze and provide recommendations.
    - Always use empathetic and simple language.
    - Respond dynamically based on the user's query or health data. Always focus on actionable, practical, and supportive advice.
    Note: Inform the user you are an AI assistant, not a substitute for medical advice.
  `,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to initialize a chat session and send messages
export async function sendMessageToGemini(input) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
                You are a healthcare assistant chatbot. Answer only health-related queries. If a query is unrelated to health, politely decline to answer.
                - Provide empathetic and supportive advice, always tailored to health contexts.
                - Disclaimer: You are an AI assistant, not a substitute for professional medical advice.
              `,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `
                I understand. I'm here to assist with health-related queries and provide insights based on health data. Please ask me any health-related question.
              `,
            },
          ],
        },
      ],
    });

    // Send the user's message to the model
    const result = await chatSession.sendMessage(input);

    // Extract and return the model's response
    return result.response.text();
  } catch (error) {
    console.error("Error interacting with Gemini API:", error);
    throw new Error("Unable to process the request.");
  }
}
