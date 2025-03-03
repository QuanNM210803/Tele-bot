import { options } from './sources/utils/options.js';
import { bot } from './sources/config/telegram-config.js';
import { geminiResponse } from './sources/service/gemini-response.js';
import './sources/schedules/schedule-job.js';
import express from "express";

Object.keys(options).forEach((key) => {
  bot.onText(new RegExp(`/${key}(?: (.+))?`), (msg, match) => {
    options[key].execute(msg, match, bot);
  });
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const isCommand = Object.keys(options).some((key) => 
    new RegExp(`/${key}(?: (.+))?`).test(msg.text)
  );

  if (!isCommand) {
    bot.sendMessage(chatId, "Đang xử lý yêu cầu của bạn...");
    const response = await geminiResponse(msg.text + "\nHãy trả lời ngắn gọn");
    bot.sendMessage(chatId, response);
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running...");
});

app.listen(PORT, () => console.log(`🚀 Server đang chạy trên cổng ${PORT}`));
