import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const bot = new TelegramBot(TOKEN, { polling: true });