import { currentDatetime } from "../service/current-datetime.js";
import { getValidOptions } from "../service/valid-options.js";
import { weather } from "../service/weather.js";
import { news } from "../service/news.js";

export const options = {
  help: {
    execute: (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, `Danh sách các lệnh:\n${getValidOptions()}`);
    },
    description: "Hiển thị danh sách các lệnh."
  },
  time: {
    execute: (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, `Thời gian hiện tại: ${currentDatetime()}`);
    },
    description: "Lấy thời gian hiện tại."
  },
  weather: {
    execute: async (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, "Đang lấy dữ liệu thời tiết...");
      const weath = await weather();
      bot.sendMessage(msg.chat.id, weath);
    },
    description: "Dự báo thời tiết tại Hà Nội."
  },
  news: {
    execute: async (msg, match, bot) => {
      bot.sendMessage(msg.chat.id, "Đang lấy dữ liệu tin tức trong ngày...");
      const _news = await news();
      _news.forEach((n, i) => {
        bot.sendMessage(msg.chat.id, `${n.title} - ${n.publishedAt}\n\n${n.summarizedContent}\n${n.link}`);
      });
    },
    description: "Tin tức trong ngày."
  }
};