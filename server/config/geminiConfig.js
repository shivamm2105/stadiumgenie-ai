import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
let isMockAI = true;

if (API_KEY && API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    isMockAI = false;
    console.log('✅ Google Gemini API client successfully initialized.');
  } catch (error) {
    console.error('❌ Failed to initialize Google Gemini API. Falling back to mock generator.', error);
  }
} else {
  console.log('⚠️ No GEMINI_API_KEY environment variable detected (or matches placeholder). Using local simulated AI processor.');
}

export { genAI, isMockAI };
