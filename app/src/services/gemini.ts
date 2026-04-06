import { LocationInfo } from "@/types/common";
import { GoogleGenAI } from "@google/genai";

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
      "activities": {
        "name": string,
        "address": string
      }[],
      "codeName": string,
      "name": string,
      "day": number
    }[]

    STRICT OUTPUT RULES:

    1. The output MUST be a valid JSON array.
    2. Do NOT include markdown, explanations, comments, or any text outside the JSON.
    3. Maintain the exact order of locations from the input.
    4. Keep the same "codeName", "name", and "day" values as the input.
    5. Each location MUST contain EXACTLY 10 activities.

    ACTIVITY STRUCTURE (STRICT ORDER):

    1–4: Ẩm thực / quán ăn đặc sản nổi bật  
    5–8: Địa điểm du lịch / tham quan nổi tiếng  
    9–10: Hoạt động / trải nghiệm nên làm  

    CONTENT RULES:

    - ALL activity names MUST be written in Vietnamese.
    - "activity" MUST only contain the name of the place, food, or experience.
    - Do NOT include address or description inside "activity".

    ADDRESS REQUIREMENTS:

    - "address" MUST contain a real location formatted similar to Google Maps results.
    - Preferred format:

    Số nhà + Tên đường, Phường/Xã, Quận/Huyện, Thành phố

    Example:

    {
      "name": "Bánh tằm cay Cà Mau",
      "address": "17 Nguyễn Trãi, Phường 5, TP Cà Mau"
    }

    or

    {
      "name": "Chợ nổi Cái Răng",
      "address": "Quốc lộ 1A, Phường Lê Bình, Quận Cái Răng, TP Cần Thơ"
    }

    STRICT ADDRESS RULES:

    - Prefer exact street addresses matching Google Maps / Google Places listings.
    - If an exact street address is unavailable, provide the most specific location possible.
    - NEVER return vague locations such as:
      - "trung tâm thành phố"
      - "khu du lịch nổi tiếng"
      - "gần chợ"

    DATA RELIABILITY RULES:

    - Only suggest places referenced by trusted sources such as:
      - Google Maps / Google Places
      - TripAdvisor
      - Traveloka
      - Lonely Planet
      - Booking.com
      - VnExpress
      - Vietravel
      - Official Vietnam tourism portals

    - Do NOT fabricate places or addresses.

    DUPLICATE RULES:

    - Do NOT repeat the same place within the same location.
    - Do NOT repeat activities.

    FINAL OUTPUT RULES:

    - Exactly 10 activities per location
    - Maintain the order of locations
    - Return JSON only
    - No extra text
    - No markdown
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
