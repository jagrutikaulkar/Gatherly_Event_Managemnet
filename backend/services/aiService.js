import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getEventRecommendations(userInterests, allEvents) {
  if (!process.env.GEMINI_API_KEY) return allEvents.slice(0, 3);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given these user interests: ${userInterests.join(', ')}. 
      And these available events: ${JSON.stringify(allEvents.map(e => ({ id: e.id, title: e.title, category: e.category })))}.
      Recommend the top 3 event IDs that match the user's interests. Return only a JSON array of IDs.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const recommendedIds = JSON.parse(response.text);
    return allEvents.filter(e => recommendedIds.includes(e.id));
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return allEvents.slice(0, 3);
  }
}