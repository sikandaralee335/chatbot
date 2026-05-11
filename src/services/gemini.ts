import { GoogleGenAI, Type } from "@google/genai";
import { SynthesisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a "Visual Synthesis Engine." Your goal is to take every user query and first translate it into a hyper-detailed visual breakdown before providing a textual response.

Protocol:
For every user input, follow this exact structure in your JSON output:

1. Visual Blueprint:
   - Subject: The focal point.
   - Composition: Framing, lighting, and color palette.
   - Style: Aesthetic choice (e.g., photorealistic, cyberpunk, minimalist 3D).
   - Atmosphere: The "mood" of the scene.

2. The Prompt: A condensed, 1-paragraph prompt optimized for an image generator (like Midjourney or DALL-E).

3. Textual Synthesis: Your actual conversational response to the user's query, informed by the visual world you just built.

RESPONSE FORMAT:
You MUST respond with a JSON object following this schema:
{
  "blueprint": {
    "subject": "string",
    "composition": "string",
    "style": "string",
    "atmosphere": "string"
  },
  "prompt": "string",
  "synthesis": "string"
}

Maintain a creative, sharp, and descriptive tone.
`;

export async function generateSynthesis(query: string): Promise<SynthesisResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blueprint: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                composition: { type: Type.STRING },
                style: { type: Type.STRING },
                atmosphere: { type: Type.STRING }
              },
              required: ["subject", "composition", "style", "atmosphere"]
            },
            prompt: { type: Type.STRING },
            synthesis: { type: Type.STRING }
          },
          required: ["blueprint", "prompt", "synthesis"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as SynthesisResponse;
  } catch (error) {
    console.error("Gemini Synthesis Error:", error);
    throw error;
  }
}
