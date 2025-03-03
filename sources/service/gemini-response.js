import { model } from "../config/gemini-config.js";
import { getValidOptions } from "./valid-options.js";

export const geminiResponse = async (message) => {
  try {
    const result = await model.generateContent(message);
    return result.response.text();
  } catch (error) {
    console.error("Lỗi Gemini AI:", error);
    const validCommands = getValidOptions();
    return `Không thể xử lý yêu cầu của bạn.\n\nCác lệnh có thể sử dụng:\n${validCommands}`;
  }
};
