const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
 
import { GEMINI_API_KEY } from '@env';


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize model
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Exporting the Gemini function for use in other files
async function Gemini(prompt) {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        // Send the prompt and get the response
        const result = await chatSession.sendMessage(prompt);

        // Return the generated response text
        return result.response.text();
    } catch (error) {
        console.error("Error during generation:", error);
        throw error;  // Rethrow error for handling at higher levels if needed
    }
}

module.exports = Gemini;
