import schedule from 'node-schedule';
import { weather } from '../service/weather.js';
import { constants } from '../utils/constants.js';
import { bot } from '../config/telegram-config.js';

schedule.scheduleJob({ hour: 19, minute: 0, second: 0, tz: "Asia/Ho_Chi_Minh" }, async () => {
  try {
    const weatherData = await weather();
    bot.sendMessage(constants?.chatId, weatherData);
    console.log("✅ Đã gửi dự báo thời tiết!");
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu thời tiết:", error);
  }
});
