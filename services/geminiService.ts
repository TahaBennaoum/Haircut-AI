import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserPreferences, HairstyleRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeFaceAndRecommend = async (
  imageBase64: string,
  prefs: UserPreferences
): Promise<AnalysisResult> => {
  
  const facialHairContext = prefs.facialHair !== 'none' 
    ? `Also, the user specifically prefers this facial hair style: ${prefs.facialHair}. Ensure the recommendations work well with this facial hair.` 
    : '';

  const prompt = `
    Analyze the uploaded face image. 
    1. Identify the face shape (Oval, Round, Square, Heart, Diamond, Oblong).
    2. Analyze key facial features (Jawline, Forehead, Cheekbones).
    3. Detect current hair type and skin tone.
    4. Based on the analysis and the user's preference for ${prefs.gender} styles, ${prefs.lengthPreference} length, and ${prefs.styleCategory} look, recommend 4 specific hairstyles.
    ${facialHairContext}
    
    Return the result in strictly structured JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.OBJECT,
            properties: {
              faceShape: { type: Type.STRING },
              faceShapeDescription: { type: Type.STRING },
              features: {
                type: Type.OBJECT,
                properties: {
                  jawline: { type: Type.STRING },
                  forehead: { type: Type.STRING },
                  cheekbones: { type: Type.STRING }
                }
              },
              detectedHairType: { type: Type.STRING },
              skinTone: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER, description: "Confidence score between 0 and 100" }
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                whyItSuits: { type: Type.STRING },
                maintenanceLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                stylingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                products: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to analyze image");
  }

  return JSON.parse(response.text) as AnalysisResult;
};

export const createCustomRecommendation = async (
  description: string,
  analysis: any,
  prefs: UserPreferences
): Promise<HairstyleRecommendation> => {
  const prompt = `
    The user wants a specific custom hairstyle described as: "${description}".
    The user's face shape is ${analysis.faceShape}.
    The user prefers ${prefs.gender} styles.
    
    Create a detailed recommendation object for this specific custom style. 
    Explain why this custom style might (or might not) suit their face shape in the 'whyItSuits' field politely.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { text: prompt },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          whyItSuits: { type: Type.STRING },
          maintenanceLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          stylingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          products: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate custom style");
  }

  return JSON.parse(response.text) as HairstyleRecommendation;
}

export const generateTryOnImage = async (
  originalImageBase64: string,
  styleName: string,
  gender: string,
  facialHair: string
): Promise<string> => {
  // Use Gemini 2.5 Flash Image for editing/transformation
  
  let facialHairPrompt = "";
  if (facialHair && facialHair !== 'none') {
    // Map internal values to natural language
    const beardMap: Record<string, string> = {
      'clean_shave': 'clean shaven face, no beard',
      'full_beard': 'full groomed beard',
      'goatee': 'goatee beard',
      'mustache': 'mustache',
      'stubble': 'italian style stubble beard'
    };
    const beardDesc = beardMap[facialHair] || facialHair;
    facialHairPrompt = `Ensure the person has a ${beardDesc}.`;
  }

  const prompt = `Edit this photo to give the person a ${styleName} hairstyle. 
  ${facialHairPrompt}
  Keep the person's face, skin tone, and background exactly the same. 
  Only change the hair (and facial hair if specified). Make it look photorealistic and high quality.
  The person presents as ${gender}.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: originalImageBase64
          }
        },
        { text: prompt }
      ]
    }
  });

  // Iterate parts to find the image
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image generated");
};