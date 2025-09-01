// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Lightweight Gemini client wrapper
// class GeminiClient {
//   constructor(apiKey) {
//     if (!apiKey) {
//       throw new Error('GEMINI_API_KEY is not set');
//     }
//     this.genAI = new GoogleGenerativeAI(apiKey);
//     this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   }

//   async generateText(prompt) {
//     const result = await this.model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   }
// }

// // Singleton
// let clientInstance;
// export const getGeminiClient = () => {
//   if (!clientInstance) {
//     clientInstance = new GeminiClient(process.env.GEMINI_API_KEY);
//   }
//   return clientInstance;
// };

// export default getGeminiClient;




import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateText(prompt) {
    const result = await this.model.generateContent(prompt); // string prompt OK
    const response = result.response; // no await needed
    return response.text();
  }
}

// Singleton
let clientInstance;
export const getGeminiClient = () => {
  if (!clientInstance) {
    clientInstance = new GeminiClient(process.env.GEMINI_API_KEY);
  }
  return clientInstance;
};

export default getGeminiClient;



