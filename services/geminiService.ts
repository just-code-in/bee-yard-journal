import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JournalEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the expected JSON output from Gemini
const journalEntrySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    weather: {
      type: Type.OBJECT,
      properties: {
        temperature: { type: Type.NUMBER, description: "Temperature in Fahrenheit" },
        condition: { type: Type.STRING, description: "Sky conditions (e.g., Foggy, Sunny)" },
        wind: { type: Type.STRING, description: "Wind speed and direction" },
      },
      required: ["temperature", "condition", "wind"],
    },
    phenology: {
      type: Type.STRING,
      description: "Local flora in bloom or significant nature observations nearby.",
    },
    narrative: {
      type: Type.STRING,
      description: "A polished, scholarly naturalist's narrative of the visit. Warm, observant tone.",
    },
    technicalNotes: {
      type: Type.OBJECT,
      properties: {
        clusterSize: { type: Type.STRING, description: "Size of the bee cluster (e.g., basketball, softball)" },
        queenStatus: { type: Type.STRING, description: "Status of the queen (Queenright, Queenless, Unknown)" },
        interventions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of actions taken (e.g., Fed syrup, Added super)",
        },
        diseases: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Any signs of disease or pests observed.",
        },
      },
      required: ["clusterSize", "queenStatus", "interventions", "diseases"],
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Names of people mentioned or needing review.",
    },
  },
  required: ["weather", "phenology", "narrative", "technicalNotes", "tags"],
};

export const parseFieldNotes = async (rawNotes: string): Promise<Partial<JournalEntry>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest",
      contents: `
        You are the Pomeroy Bee Yard Naturalist AI. 
        Your task is to take these rough field notes and convert them into a structured JSON log entry.
        
        The narrative tone should be: Warm, scholarly, and observant ("Modern Naturalist"). 
        Use high-level English suitable for a field journal.
        
        Current Date Context: ${new Date().toLocaleDateString()}
        Location: San Francisco, Coastal Dunes (Pomeroy Center).

        Raw Notes:
        "${rawNotes}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: journalEntrySchema,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        author: "Justin Simpson", // Default for now
      };
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Error parsing field notes:", error);
    throw error;
  }
};

export const generateBotanicalSketch = async (plantName: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Vintage botanical pencil sketch illustration of ${plantName}, white background, scientific accuracy, detailed line work, subtle color.`
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating sketch:", error);
    return null;
  }
};
