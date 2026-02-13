import { GoogleGenAI } from "@google/genai";
import { LocationInfo } from "../model";

const initPrompt = (
  upcomingLocations: LocationInfo[],
) => `You are a professional travel research assistant specializing in Vietnam tourism.

  Input will be an array in the following format:

  [
    {
      "codeName": "gia_lai",
      "name": "Gia Lai",
      "status": "UPCOMING"
    }
  ]

  Inputs: ${JSON.stringify(upcomingLocations)}

  Your task:

  Return an array with the following TypeScript structure:

  {
    locationName: string;
    activities: string[];
  }[]

  STRICT REQUIREMENTS:

  1. The output must be a valid JSON array.
  2. Copy "codeName" exactly from the input.
  3. "actionsAtLocation" must contain EXACTLY 10 items.
  4. The 10 items must be structured in this exact order:

    - First 4 items: Ẩm thực / quán ăn đặc sản nổi bật.
    - Next 4 items: Địa điểm du lịch / tham quan nổi tiếng.
    - Last 2 items: Hoạt động / trải nghiệm nên làm.

  5. ALL content inside "actionsAtLocation" MUST be written in Vietnamese.
  6. Each item must be a detailed string including:
    - Tên địa điểm / món ăn
    - Mô tả ngắn gọn
    - Địa chỉ chính xác, đầy đủ
  7. Suggestions MUST be researched from reputable travel websites (Facebook, Tiktok, Traveloka, TripAdvisor, Lonely Planet, Booking.com, official tourism portals, etc.).
  8. Do NOT fabricate information.
  9. Do NOT return more or fewer than 10 items.
  10. Return JSON only. No markdown. No explanation. No extra text.
`;

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});
const model = process.env.NEXT_PUBLIC_GEMINI_MODEL || "";

export const GeminiService = {
  askGeminiToCreatePlan: async (upcomingLocations: LocationInfo[]) => {
    if (model) {
      const response = await ai.models.generateContent({
        model: model,
        contents: initPrompt(upcomingLocations),
      });
      return response.text;
    }
  },
};
