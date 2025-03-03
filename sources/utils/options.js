import { currentDatetime } from "../service/current-datetime.js";
import { getValidOptions } from "../service/valid-options.js";
import { weather } from "../service/weather.js";

export const options = {
  info: {
    execute: (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, `Tôi là bot hỗ trợ của bạn.\n\nTôi có thể giúp bạn:\n${getValidOptions()}\n`);
    },
    description: "Thông tin về bot."
  },
  time: {
    execute: (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, `Thời gian hiện tại: ${currentDatetime()}`);
    },
    description: "Lấy thời gian hiện tại."
  },
  help: {
    execute: (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, `Danh sách các lệnh:\n${getValidOptions()}`);
    },
    description: "Hiển thị danh sách các lệnh."
  },
  weather: {
    execute: async (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, "Đang lấy dữ liệu thời tiết...");
      const weath = await weather();
      bot.sendMessage(msg.chat.id, weath);
    },
    description: "Dự báo thời tiết tại Hà Nội."
  }
};