import { GoogleGenAI } from "@google/genai";
import { LocationInfo } from "../model";

const initPrompt = (
  upcomingLocations: LocationInfo[],
) => `You are a professional travel research assistant specializing in Vietnam tourism.
Input will be an array in the following format:
[
  {
    "activities": [],
    "codeName": "ca_mau",
    "name": "Cà Mau",
    "day": 1
  },
  {
    "activities": [],
    "codeName": "can_tho",
    "name": "Cần Thơ",
    "day": 1
  }
]
Inputs: ${JSON.stringify(upcomingLocations)}
Your task:
Return an array with the following TypeScript structure:
{
  "activities": string[],
  "codeName": string,
  "name": string,
  "day": number
}[]
STRICT REQUIREMENTS:
1. The output must be a valid JSON array.
2. For each input object, use its "name" as "locationName" in output.
3. "activities" must contain EXACTLY 10 items per location.
4. The 10 items must be structured in this exact order:
   - First 4 items: Ẩm thực / quán ăn đặc sản nổi bật.
   - Next 4 items: Địa điểm du lịch / tham quan nổi tiếng.
   - Last 2 items: Hoạt động / trải nghiệm nên làm.
5. ALL content inside "activities" MUST be written in Vietnamese.
6. Each item must be a detailed string including:
   - Tên địa điểm / món ăn
   - Địa chỉ chính xác, đầy đủ (nếu có thể, hoặc khu vực cụ thể nếu không có địa chỉ chi tiết)
7. Suggestions MUST be researched from reputable travel websites (TripAdvisor, Traveloka, Lonely Planet, Booking.com, VnExpress, Vietravel, official tourism portals, etc.).
8. Do NOT fabricate information.
9. Do NOT return more or fewer than 10 items per location.
10. Return JSON only. No markdown. No explanation. No extra text.`;

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
